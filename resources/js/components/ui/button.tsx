import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-body font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:focus-ring touch-target mobile-tap active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 border border-primary/20 hover:border-primary/30",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 border border-destructive/20 hover:border-destructive/30",
        outline:
          "border border-border bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-secondary/20 hover:border-secondary/30",
        ghost:
          "hover:bg-accent hover:text-accent-foreground border border-transparent hover:border-accent/20",
        link: "text-primary underline-offset-4 hover:underline min-h-[44px] border border-transparent",
      },
      size: {
        default: "h-11 px-4 py-3 sm:px-6 has-[>svg]:px-3 sm:has-[>svg]:px-4", // 44px minimum height, responsive padding
        sm: "h-10 px-3 py-2 sm:px-4 has-[>svg]:px-2 sm:has-[>svg]:px-3 text-body-sm", // 40px for compact areas
        lg: "h-12 px-6 py-4 sm:px-8 has-[>svg]:px-4 sm:has-[>svg]:px-6 text-subheading", // 48px for prominent actions
        icon: "size-11", // 44px square
        "icon-sm": "size-10", // 40px square
        "icon-lg": "size-12", // 48px square
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
