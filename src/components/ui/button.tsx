import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/btn inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-md font-medium uppercase tracking-[0.12em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default: "bg-ink text-paper hover:bg-clay-600",
        accent: "bg-clay-500 text-paper hover:bg-clay-600",
        outline:
          "border border-ink/25 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-paper",
        ghost: "text-ink hover:bg-secondary",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
        link: "p-0 h-auto normal-case tracking-normal text-ink underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-7 text-[11px]",
        sm: "h-9 px-4 text-[10px]",
        lg: "h-14 px-10 text-xs",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render the single child element (e.g. a <Link>) with button styles instead of a <button>. */
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, className }));

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ className?: string }>;
      return React.cloneElement(child, {
        className: cn(classes, child.props.className),
        ...props,
      });
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
