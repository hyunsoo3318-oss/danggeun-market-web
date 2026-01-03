import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

const buttonVariants = cva(
  "rounded-lg font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-primary text-text-inverse hover:bg-primary-hover border border-transparent",
        secondary: "bg-bg-box text-text-heading hover:bg-border-base border border-transparent",
        outline: "border border-border-medium text-text-body hover:bg-bg-box-light",
        ghost: "bg-transparent text-text-secondary hover:bg-bg-box-light hover:text-text-primary",
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-3 text-base",
        lg: "px-6 py-3.5 text-lg",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({
  className,
  variant,
  size,
  fullWidth,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
}

// Export variants for reuse (e.g., Link styled as Button)
export { buttonVariants };
