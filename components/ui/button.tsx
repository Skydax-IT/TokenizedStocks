import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-foreground hover:bg-accent-700 focus:ring-2 focus:ring-accent/55 focus:ring-offset-2",
        destructive: "bg-danger text-white hover:bg-danger/90 focus:ring-2 focus:ring-danger/55 focus:ring-offset-2",
        outline: "border border-border bg-background text-fg hover:bg-accent/6 hover:border-accent/20 focus:ring-2 focus:ring-accent/55 focus:ring-offset-2",
        secondary: "bg-accent/8 text-accent border border-border hover:bg-accent/12 focus:ring-2 focus:ring-accent/55 focus:ring-offset-2",
        ghost: "hover:bg-accent/6 hover:text-accent focus:ring-2 focus:ring-accent/55 focus:ring-offset-2",
        link: "text-accent underline-offset-4 hover:underline focus:ring-2 focus:ring-accent/55 focus:ring-offset-2",
        success: "bg-success text-white hover:bg-success/90 focus:ring-2 focus:ring-success/55 focus:ring-offset-2",
        warning: "bg-warning text-white hover:bg-warning/90 focus:ring-2 focus:ring-warning/55 focus:ring-offset-2",
        premium: "bg-gradient-to-r from-accent-600 to-accent-700 text-white hover:from-accent-700 hover:to-accent-800 focus:ring-2 focus:ring-accent/55 focus:ring-offset-2 shadow-lg",
        gradient: "bg-gradient-to-r from-accent-500 via-accent-600 to-accent-700 text-white hover:from-accent-600 hover:via-accent-700 hover:to-accent-800 focus:ring-2 focus:ring-accent/55 focus:ring-offset-2 shadow-md",
        subtle: "bg-muted/20 text-muted hover:bg-muted/30 hover:text-fg focus:ring-2 focus:ring-accent/55 focus:ring-offset-2",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-md px-10 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "outline", // Changed default to outline for secondary actions
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
