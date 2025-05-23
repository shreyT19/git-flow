import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/tailwind.utils";
import { getIconForKeyword, IconType } from "@/utils/icons.utils";
import { useEffect, useState } from "react";
import ToolTip, { IToolTipProps } from "@/components/ui/tooltip";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      effect: {
        expandIcon: "group gap-0 relative",
        ringHover:
          "transition-all duration-300 hover:ring-2 hover:ring-primary/90 hover:ring-offset-2",
        shine:
          "before:animate-shine relative overflow-hidden before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-no-repeat background-position_0s_ease",
        shineHover:
          "relative overflow-hidden before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:transition-[background-position_0s_ease] hover:before:bg-[position:-100%_0,0_0] before:duration-1000",
        gooeyRight:
          "relative z-0 overflow-hidden transition-all duration-500 before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5] before:rounded-[100%] before:bg-gradient-to-r from-white/40 before:transition-transform before:duration-1000  hover:before:translate-x-[0%] hover:before:translate-y-[0%]",
        gooeyLeft:
          "relative z-0 overflow-hidden transition-all duration-500 after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l from-white/40 after:transition-transform after:duration-1000  hover:after:translate-x-[0%] hover:after:translate-y-[0%]",
        underline:
          "relative !no-underline after:absolute after:bg-primary after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-left after:scale-x-100 hover:after:origin-bottom-right hover:after:scale-x-0 after:transition-transform after:ease-in-out after:duration-300",
        hoverUnderline:
          "relative !no-underline after:absolute after:bg-primary after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-8 rounded-md px-2 text-xs",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
export type IButtonVariants = NonNullable<ButtonVariants["variant"]>;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingPosition?: "left" | "right";
  onClick?: React.MouseEventHandler<HTMLButtonElement> | (() => Promise<void>);
  tooltipTitle?: string;
  tooltipProps?: Omit<IToolTipProps, "title" | "children">;
  icon?: IconType;
  iconPlacement?: "left" | "right";
}

const ButtonComponent = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      effect,
      size,
      icon: Icon,
      iconPlacement,
      asChild = false,
      loading = false,
      loadingPosition = "left",
      onClick,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    // supports both external isLoading and internal loading state
    const [isLoading, setIsLoading] = useState<boolean>(loading);

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!onClick) return;
      try {
        setIsLoading(true);
        await Promise.resolve(onClick(e));
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      setIsLoading(loading);
    }, [loading]);

    const showLeftIcon =
      Icon &&
      iconPlacement === "left" &&
      !(isLoading && loadingPosition === "left");
    const showRightIcon =
      Icon &&
      iconPlacement === "right" &&
      !(isLoading && loadingPosition === "right");
    const showLeftLoader = isLoading && loadingPosition === "left";
    const showRightLoader = isLoading && loadingPosition === "right";

    return (
      <Comp
        className={cn(buttonVariants({ variant, effect, size, className }))}
        ref={ref}
        onClick={handleClick}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {showLeftLoader && getIconForKeyword("loader2", "animate-spin mr-2")}

        {showLeftIcon &&
          (effect === "expandIcon" ? (
            <div className="group-hover:translate-x-100 w-0 translate-x-[0%] pr-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:pr-2 group-hover:opacity-100">
              {getIconForKeyword(Icon)}
            </div>
          ) : (
            getIconForKeyword(Icon)
          ))}

        <Slottable>{props.children}</Slottable>

        {showRightIcon &&
          (effect === "expandIcon" ? (
            <div className="w-0 translate-x-[100%] pl-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-2 group-hover:opacity-100">
              {getIconForKeyword(Icon)}
            </div>
          ) : (
            getIconForKeyword(Icon)
          ))}

        {showRightLoader && getIconForKeyword("loader2", "animate-spin ml-2")}
      </Comp>
    );
  },
);
ButtonComponent.displayName = "ButtonComponent";

// Button wrapper with tooltip support
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const { tooltipTitle, tooltipProps, ...buttonProps } = props;

    if (tooltipTitle) {
      return (
        <ToolTip title={tooltipTitle} {...tooltipProps}>
          <ButtonComponent ref={ref} {...buttonProps} />
        </ToolTip>
      );
    }

    return <ButtonComponent ref={ref} {...buttonProps} />;
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
