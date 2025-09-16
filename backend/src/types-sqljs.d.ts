declare module 'sql.js' {
    export interface SqlJsStatic {
        Database: any;
        default: any;
    }
    export interface SqlJsConfig {
        locateFile?(file: string): string;
    }
    export type Database = any;
    const initSqlJs: (config: SqlJsConfig) => Promise<SqlJsStatic>;
    export default initSqlJs;
    export { initSqlJs };
}