import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const switchVariants = cva(
    "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-200",
    {
        variants: {
            variant: {
                default: "",
            },
            size: {
                default: "",
                sm: "h-4 w-7",
                lg: "h-8 w-14",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface SwitchProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof switchVariants> {
    onCheckedChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
    ({ className, variant, size, checked, onCheckedChange, ...props }, ref) => {
        return (
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    ref={ref}
                    checked={checked}
                    onChange={(e) => onCheckedChange?.(e.target.checked)}
                    {...props}
                />
                <div
                    className={cn(switchVariants({ variant, size, className }))}
                    data-state={checked ? "checked" : "unchecked"}
                >
                    <div
                        data-state={checked ? "checked" : "unchecked"}
                        className={cn(
                            "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
                            size === 'sm' && "h-3 w-3 data-[state=checked]:translate-x-3",
                            size === 'lg' && "h-7 w-7 data-[state=checked]:translate-x-6"
                        )}
                    />
                </div>
            </label>
        )
    }
)
Switch.displayName = "Switch"

export { Switch }
