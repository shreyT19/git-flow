import * as React from "react";
import { cn } from "@/utils/tailwind.utils";
import ConditionalWrapper from "../global/ConditionalWrapper";
import { InfoIcon } from "lucide-react";

interface InputProps
  extends React.ComponentProps<"input">,
    React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  description?: string;
  descriptionClassName?: string;
}

const Input = React.forwardRef(
  (
    {
      className,
      type,
      description,
      descriptionClassName,
      ...props
    }: InputProps,
    ref,
  ) => {
    return (
      <div className="flex flex-col gap-1">
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className,
          )}
          ref={ref as React.Ref<HTMLInputElement>}
          {...props}
        />
        <ConditionalWrapper show={Boolean(description)}>
          <div
            className={cn(
              "text-s flex items-center gap-1 text-muted-foreground",
              descriptionClassName,
            )}
          >
            <InfoIcon className="h-3 w-3" />
            <p>{description}</p>
          </div>
        </ConditionalWrapper>
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
