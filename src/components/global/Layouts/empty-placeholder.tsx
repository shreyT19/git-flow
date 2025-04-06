import { Button, ButtonProps } from "@/components/ui/button";
import { getIconForKeyword, IconType } from "@/utils/icons.utils";
import React from "react";

type Props = {
  visible: boolean;
  icon: IconType;
  text: string;
  actions?: ButtonProps[];
};

const EmptyPlaceHolder = ({ visible = false, icon, text, actions }: Props) => {
  if (!visible) return null;
  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200/80 bg-white px-6 py-8 text-center shadow-sm">
        <div className="mb-2 rounded-full bg-gray-50 p-2.5">
          {getIconForKeyword(icon, "size-8 text-gray-400")}
        </div>
        <p className="mb-4 text-sm text-gray-500">{text}</p>
        {actions && actions.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            {actions.map((action, index) => (
              <Button key={index} size="sm" {...action} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyPlaceHolder;
