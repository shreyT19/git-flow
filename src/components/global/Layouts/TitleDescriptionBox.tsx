import React from "react";
import {
  MotionH1,
  MotionH2,
  MotionH3,
  MotionP,
  SlideUpDiv,
} from "@/components/global/MotionTag";
import { cn } from "@/utils/tailwind.utils";
import { HTMLMotionProps } from "motion/react";

// Typography components with strict styling
export const Typography = {
  h1: ({
    children,
    className,
    ...props
  }: Omit<HTMLMotionProps<"h1">, "ref">) => (
    <MotionH1
      className={cn(
        "text-lg font-bold tracking-tight md:text-xl lg:text-2xl",
        className,
      )}
      {...props}
    >
      {children}
    </MotionH1>
  ),
  h2: ({
    children,
    className,
    ...props
  }: Omit<HTMLMotionProps<"h2">, "ref">) => (
    <MotionH2
      className={cn(
        "text-md font-semibold tracking-tight md:text-lg",
        className,
      )}
      {...props}
    >
      {children}
    </MotionH2>
  ),
  h3: ({
    children,
    className,
    ...props
  }: Omit<HTMLMotionProps<"h3">, "ref">) => (
    <MotionH3
      className={cn(
        "text-sm font-semibold tracking-tight md:text-base",
        className,
      )}
      {...props}
    >
      {children}
    </MotionH3>
  ),
  p: ({ children, className, ...props }: Omit<HTMLMotionProps<"p">, "ref">) => (
    <MotionP
      className={cn(
        "text-xs leading-6 text-muted-foreground md:text-sm",
        className,
      )}
      {...props}
    >
      {children}
    </MotionP>
  ),
};

// TitleDescriptionBox variants
type TitleDescriptionVariant = "primary" | "secondary" | "tertiary";

interface TitleDescriptionBoxProps {
  title: string;
  description?: string;
  variant?: TitleDescriptionVariant;
  titleClassName?: string;
  descriptionClassName?: string;
  className?: string;
  titleAs?: "h1" | "h2" | "h3";
  align?: "left" | "center" | "right";
}

export const TitleDescriptionBox: React.FC<TitleDescriptionBoxProps> = ({
  title,
  description,
  variant = "primary",
  titleClassName,
  descriptionClassName,
  className,
  titleAs = "h2",
  align = "left",
}) => {
  // Define variant-specific styles
  const variantStyles = {
    primary: {
      title: "text-foreground/70",
      description: "text-muted-foreground/80 text-sm",
    },
    secondary: {
      title: "text-foreground",
      description: "text-muted-foreground/80",
    },
    tertiary: {
      title: "text-muted-foreground font-medium",
      description: "text-muted-foreground/70 text-sm",
    },
  };

  const styles = variantStyles[variant];
  const TitleComponent = Typography[titleAs];

  const alignmentClasses = {
    left: "text-left",
    center: "text-center mx-auto",
    right: "text-right ml-auto",
  };

  return (
    <SlideUpDiv className={cn(alignmentClasses[align], className)}>
      <TitleComponent className={cn(styles.title, titleClassName)}>
        {title}
      </TitleComponent>
      {description && (
        <Typography.p className={cn(styles.description, descriptionClassName)}>
          {description}
        </Typography.p>
      )}
    </SlideUpDiv>
  );
};
