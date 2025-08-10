import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-accent text-accent-foreground hover:bg-accent/80",
        secondary:
          "border-transparent bg-muted/20 text-muted hover:bg-muted/30",
        destructive:
          "border-transparent bg-danger/10 text-danger hover:bg-danger/20",
        outline: "text-foreground border-border",
        success:
          "border-transparent bg-success/10 text-success hover:bg-success/20",
        warning:
          "border-transparent bg-warning/10 text-warning hover:bg-warning/20",
        premium:
          "border-transparent bg-accent/12 text-accent hover:bg-accent/20",
        info:
          "border-transparent bg-accent/10 text-accent hover:bg-accent/20",
        gradient:
          "border-transparent bg-gradient-to-r from-accent-500 to-accent-600 text-white",
        status:
          "border-transparent bg-success/10 text-success hover:bg-success/20",
        neutral:
          "border-transparent bg-muted/30 text-muted hover:bg-muted/40",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
