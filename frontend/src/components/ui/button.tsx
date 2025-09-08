import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-50 disabled:pointer-events-none gap-2',
  {
    variants: {
      variant: {
  default: 'bg-brand-600 text-white hover:bg-brand-700 shadow',
  outline: 'border border-input bg-transparent hover:bg-brand-50',
  ghost: 'hover:bg-brand-50 hover:text-brand-700',
        secondary: 'bg-gray-900 text-white hover:bg-black/80 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-11 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  variant?: NonNullable<VariantProps<typeof buttonVariants>['variant']>
  size?: NonNullable<VariantProps<typeof buttonVariants>['size']>
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
