import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "motion/react";
import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(!!value);
  const [showClearButton, setShowClearButton] = useState(!!value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggleSearch = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setShowClearButton(true);
      onChange("");
      // Focus input after expansion
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 10);
    }
  };

  const handleCloseSearch = () => {
    if (!value.trim()) {
      setShowClearButton(false);
      setIsExpanded(false);
      onChange("");
    }
  };

  const handleClearSearch = () => {
    setShowClearButton(false);
    onChange("");
    // Refocus the input after clearing
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className="relative flex items-center">
      <div className="relative h-9 w-auto">
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ width: 40, opacity: 0.5 }}
            animate={{ width: 250, opacity: 1 }}
            exit={{ width: 40, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 60,
            }}
            className="relative flex items-center"
          >
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={value || ""}
              onChange={(e) => {
                onChange(e.target.value);
                setShowClearButton(!!e.target.value);
              }}
              className="h-9 w-full bg-white px-9 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              onBlur={handleCloseSearch}
            />
            <AnimatePresence>
              {value && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute right-5 -translate-y-1/2"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    tooltipTitle="Clear search"
                    className="h-7 w-7 transition-colors duration-200 hover:bg-gray-100"
                    onClick={handleClearSearch}
                    tabIndex={showClearButton ? 0 : -1}
                    icon="x"
                    iconPlacement="left"
                    tooltipProps={{
                      side: "right",
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div
            key="collapsed"
            className="absolute w-10 transition-all duration-300 ease-in-out"
          >
            <Button
              variant="outline"
              size="sm"
              tooltipTitle="Search"
              onClick={handleToggleSearch}
              icon="search"
              iconPlacement="left"
            />
          </div>
        )}
      </div>
    </div>
  );
};
