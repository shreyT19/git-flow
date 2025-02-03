import React from "react";

interface ConditionalWrapperProps {
  show: boolean;
  children: React.ReactNode;
  /**
   * Optional class name to apply to the wrapper div
   * Incase you want to apply some styles to the wrapper like animations etc
   */
  className?: string;
}

const ConditionalWrapper = ({
  show,
  children,
  className,
}: ConditionalWrapperProps) => {
  if (!show) {
    return null;
  }

  if (className) {
    return <div className={className}>{children}</div>;
  }

  return <>{children}</>;
};

export default ConditionalWrapper;
