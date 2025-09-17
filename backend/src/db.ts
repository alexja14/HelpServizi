import path from 'path';
import fs from 'fs/promises';
import initSqlJs, { Database as SQLWasm } from 'sql.js';

// Lazy init state
let dbPromise: Promise<SQLWasm> | null = null;

// Resolve database path (robust for production deployments):
// 1. If SQLITE_PATH is absolute, use it.
// 2. If SQLITE_PATH is relative, resolve it relative to the backend root (one level up from compiled dist) so
//    systemd / process managers that start the process with an arbitrary working directory still work.
// 3. If not provided, default to <backend root>/data.sqlite.
// 4. We keep it mutable so we can fallback later if an ENOENT occurs writing the temp file (very rare edge cases).
const backendRoot = path.join(__dirname, '..');
const rawDbPath = process.env.SQLITE_PATH || path.join(backendRoot, 'data.sqlite');
let DB_PATH = path.isAbsolute(rawDbPath) ? rawDbPath : path.join(backendRoot, rawDbPath);

async function ensureDBDir() {
    const dir = path.dirname(DB_PATH);
    if (dir === '.' || dir === '') return; // current dir – nothing to create
    try { await fs.mkdir(dir, { recursive: true }); } catch { /* ignore */ }
}

// Persistence + backup tuning (env overrides supported)
const PERSIST_DEBOUNCE_MS = Number(process.env.DB_PERSIST_DEBOUNCE_MS || 300); // debounce window for grouping writes
const BACKUP_INTERVAL_MS = Number(process.env.DB_BACKUP_INTERVAL_MS || 1000 * 60 * 5); // default 5 min
const BACKUPS_TO_KEEP = Number(process.env.DB_BACKUPS_TO_KEEP || 10);
const BACKUP_DIR = process.env.DB_BACKUP_DIR || path.join(__dirname, '..', 'db_backups');

// Internal persistence state
let pendingPersist = false;
let persistScheduled = false;
let persistTimer: ReturnType<typeof setTimeout> | null = null;
let backupIntervalStarted = false;

async function writeDBFile(db: SQLWasm) {
    const data = db.export();
    const buffer = Buffer.from(data);
    await ensureDBDir();
    // Always place tmp file in same directory for atomic rename safety across filesystems
    const dir = path.dirname(DB_PATH);
    const base = path.basename(DB_PATH);
    const tmp = path.join(dir === '.' ? '' : dir, `.${base}.tmp`); // dotted temp for easier ignore patterns
    try {
        await fs.writeFile(tmp, buffer);
        await fs.rename(tmp, DB_PATH);
    } catch (err: any) {
        if (err?.code === 'ENOENT') {
            // Fallback: attempt to relocate DB into backendRoot (covers cases where relative path pointed to a non-existent dir)
            const fallback = path.join(backendRoot, base);
            if (fallback !== DB_PATH) {
                try {
                    await fs.mkdir(path.dirname(fallback), { recursive: true });
                    const fallbackTmp = fallback + '.tmp';
                    await fs.writeFile(fallbackTmp, buffer);
                    await fs.rename(fallbackTmp, fallback);
                    console.warn(`[db] Primary DB path failed (${DB_PATH}). Using fallback ${fallback}`);
                    DB_PATH = fallback; // update for future writes
                } catch (e2) {
                    console.error('[db] Fallback DB write failed', e2);
                    throw e2;
                }
            } else {
                throw err;
            }
        } else {
            throw err;
        }
    }
}

async function flushIfPending(db: SQLWasm) {
    if (!pendingPersist) return;
    pendingPersist = false;
    try {
        await writeDBFile(db);
    } catch (err) {
        console.error('[db] flush persist error', err);
    }
}

function schedulePersist(db: SQLWasm) {
    pendingPersist = true;
    if (persistScheduled) return; // already have a timer
    persistScheduled = true;
    persistTimer = setTimeout(() => {
        persistScheduled = false;
        flushIfPending(db).catch(err => console.error('[db] scheduled persist error', err));
    }, PERSIST_DEBOUNCE_MS);
}

// --- Backup logic ---
async function ensureBackupDir() {
    try { await fs.mkdir(BACKUP_DIR, { recursive: true }); } catch { /* ignore */ }
}

function timestamp() {
    const d = new Date();
    // YYYYMMDD-HHMMSS
    return d.toISOString().replace(/[-:]/g, '').replace(/\..+/, '');
}

async function createBackup(db: SQLWasm) {
    await ensureBackupDir();
    const fileName = `backup-${timestamp()}.sqlite`;
    const backupPath = path.join(BACKUP_DIR, fileName);
    try {
        const data = db.export();
        await fs.writeFile(backupPath, Buffer.from(data));
        await pruneBackups();
        console.log('[db] backup created', fileName);
    } catch (err) {
        console.error('[db] backup error', err);
    }
}

async function pruneBackups() {
    let files: string[] = [];
    try { files = await fs.readdir(BACKUP_DIR); } catch { return; }
    const backupFiles = files.filter(f => /^backup-\d{8}T?\d{6}\.sqlite$/.test(f)).sort();
    const excess = backupFiles.length - BACKUPS_TO_KEEP;
    if (excess <= 0) return;
    const toDelete = backupFiles.slice(0, excess); // oldest first due to sort
    await Promise.all(toDelete.map(f => fs.unlink(path.join(BACKUP_DIR, f)).catch(() => { })));
    if (toDelete.length) console.log('[db] pruned backups', toDelete.length);
}

function startBackupInterval(db: SQLWasm) {
    if (backupIntervalStarted) return;
    backupIntervalStarted = true;
    if (BACKUP_INTERVAL_MS <= 0) return; // disabled
    setInterval(() => {
        // Before creating a backup, flush any pending writes so snapshot is current
        flushIfPending(db).then(() => createBackup(db));
    }, BACKUP_INTERVAL_MS).unref?.();
}

// Schema DDL (no triggers for simplicity – we recompute updatedAt in code)
const SCHEMA = `
CREATE TABLE IF NOT EXISTS Task (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS Lead (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    lastName TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    cafFlag INTEGER NOT NULL DEFAULT 0,
    unemployed INTEGER NOT NULL DEFAULT 0,
    consent INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

async function loadDB(): Promise<SQLWasm> {
    if (!dbPromise) {
        dbPromise = (async () => {
            const SQL = await initSqlJs({});
            let db: SQLWasm;
            try {
                await ensureDBDir();
                const file = await fs.readFile(DB_PATH);
                db = new SQL.Database(file);
            } catch {
                db = new SQL.Database();
            }
            db.run('PRAGMA foreign_keys = ON;');
            db.run(SCHEMA); // idempotent
            console.log('[db] using database file', DB_PATH);
            return db;
        })();
    }
    return dbPromise;
}

// (removed old inline persist/throttle implementation)

// Utility row mapping
function rowToTask(row: any) {
    return {
        id: row.id,
        title: row.title,
        completed: !!row.completed,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt)
    };
}
function rowToLead(row: any) {
    return {
        id: row.id,
        name: row.name,
        lastName: row.lastName,
        email: row.email,
        phone: row.phone,
        cafFlag: !!row.cafFlag,
        unemployed: !!row.unemployed,
        consent: !!row.consent,
        createdAt: new Date(row.createdAt)
    };
}

// Generic helpers
function selectAll(db: SQLWasm, sql: string, params: any[] = []) {
    const stmt = db.prepare(sql);
    try {
        stmt.bind(params);
        const rows: any[] = [];
        while (stmt.step()) rows.push(stmt.getAsObject());
        return rows;
    } finally { stmt.free(); }
}
function selectOne(db: SQLWasm, sql: string, params: any[] = []) {
    const rows = selectAll(db, sql, params);
    return rows[0];
}
function run(db: SQLWasm, sql: string, params: any[] = []) {
    const stmt = db.prepare(sql);
    try { stmt.run(params); } finally { stmt.free(); }
}

// --- DAO (async) ---
export async function listTasks() {
    const db = await loadDB();
    const rows = selectAll(db, 'SELECT * FROM Task ORDER BY createdAt DESC');
    return rows.map(rowToTask);
}
export async function createTask(title: string) {
    const db = await loadDB();
    run(db, 'INSERT INTO Task (title) VALUES (?)', [title]);
    // last row id
    const row = selectOne(db, 'SELECT * FROM Task ORDER BY id DESC LIMIT 1');
    schedulePersist(db);
    return rowToTask(row);
}
export async function getTask(id: number) {
    const db = await loadDB();
    const row = selectOne(db, 'SELECT * FROM Task WHERE id = ?', [id]);
    return row ? rowToTask(row) : undefined;
}
export async function updateTask(id: number, data: { title?: string; completed?: boolean }) {
    const db = await loadDB();
    const current = await getTask(id);
    if (!current) throw new Error('not_found');
    const newTitle = data.title ?? current.title;
    const newCompleted = (typeof data.completed === 'boolean') ? (data.completed ? 1 : 0) : (current.completed ? 1 : 0);
    run(db, `UPDATE Task SET title = ?, completed = ?, updatedAt = datetime('now') WHERE id = ?`, [newTitle, newCompleted, id]);
    const row = selectOne(db, 'SELECT * FROM Task WHERE id = ?', [id]);
    schedulePersist(db);
    return rowToTask(row);
}
export async function deleteTask(id: number) {
    const db = await loadDB();
    run(db, 'DELETE FROM Task WHERE id = ?', [id]);
    schedulePersist(db);
}

export async function createLead(data: { name: string; lastName: string; email: string; phone?: string; cafFlag: boolean; unemployed: boolean; consent: boolean; }) {
    const db = await loadDB();
    try {
        run(db, `INSERT INTO Lead (name,lastName,email,phone,cafFlag,unemployed,consent) VALUES (?,?,?,?,?,?,?)`, [
            data.name, data.lastName, data.email, data.phone || null, data.cafFlag ? 1 : 0, data.unemployed ? 1 : 0, data.consent ? 1 : 0
        ]);
    } catch (e: any) {
        if (String(e.message).includes('UNIQUE') || String(e.message).includes('unique')) {
            const err: any = new Error('unique_email');
            err.code = 'unique_email';
            throw err;
        }
        throw e;
    }
    const row = selectOne(db, 'SELECT * FROM Lead ORDER BY id DESC LIMIT 1');
    schedulePersist(db);
    return rowToLead(row);
}
export async function listLeads() {
    const db = await loadDB();
    const rows = selectAll(db, 'SELECT * FROM Lead ORDER BY createdAt DESC');
    return rows.map(rowToLead);
}
export async function getLead(id: number) {
    const db = await loadDB();
    const row = selectOne(db, 'SELECT * FROM Lead WHERE id = ?', [id]);
    return row ? rowToLead(row) : undefined;
}

// Graceful shutdown flush (optional best-effort)
export async function closeDatabase() {
    if (!dbPromise) return;
    const db = await dbPromise;
    await flushIfPending(db);
    db.close();
}

// After first successful load, start backup timer
async function postLoadSetup(db: SQLWasm) {
    startBackupInterval(db);
}

// Patch loadDB to trigger backup interval exactly once (after schema)
// We append at end of existing loadDB logic by re-wrapping original function if desired.
// Simpler: monkey-patch by calling postLoadSetup within loadDB after creation.
// (We cannot edit earlier loadDB definition inline now without larger diff; instead we reassign.)
const _originalLoad = loadDB;
// @ts-ignore redefine
loadDB = async function (): Promise<SQLWasm> { // eslint-disable-line no-redeclare
    const db = await _originalLoad();
    postLoadSetup(db); // idempotent internally
    return db;
};

process.on('SIGTERM', () => { closeDatabase().finally(() => process.exit(0)); });
process.on('SIGINT', () => { closeDatabase().finally(() => process.exit(0)); });
