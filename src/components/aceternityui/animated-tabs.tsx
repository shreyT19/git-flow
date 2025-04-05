"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/utils/tailwind.utils";
import { type IconType, getIconForKeyword } from "@/utils/icons.utils";

type Tab = {
  title: string;
  value: string;
  content?: string | React.ReactNode | any;
  icon?: IconType;
};

export const AnimatedTabs = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
  onTabChange,
  activeTab,
}: {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
  onTabChange?: (value: string) => void;
  activeTab?: string;
}) => {
  const [active, setActive] = useState<Tab | undefined>(
    activeTab ? propTabs.find((tab) => tab.value === activeTab) : propTabs[0],
  );
  const [tabs, setTabs] = useState<Tab[]>(propTabs);

  // Update active tab and tabs state when props change (e.g., on reload)
  useEffect(() => {
    const activeTabObj = activeTab
      ? propTabs.find((tab) => tab.value === activeTab)
      : propTabs[0];

    setActive(activeTabObj);

    // If there's an active tab, reorganize tabs to put active one first
    if (activeTabObj) {
      const activeIndex = propTabs.findIndex(
        (tab) => tab.value === activeTabObj.value,
      );
      if (activeIndex !== -1) {
        const newTabs = [...propTabs];
        const selectedTab = newTabs.splice(activeIndex, 1);
        newTabs.unshift(selectedTab[0]!);
        setTabs(newTabs);
      } else {
        setTabs(propTabs);
      }
    } else {
      setTabs(propTabs);
    }
  }, [propTabs, activeTab]);

  const moveSelectedTabToTop = (idx: number) => {
    const newTabs = [...propTabs];
    const selectedTab = newTabs.splice(idx, 1);
    newTabs.unshift(selectedTab[0]!);
    setTabs(newTabs);
    setActive(newTabs[0]);
  };

  const [hovering, setHovering] = useState(false);

  const isActive = (tab: Tab) => {
    return tab.value === active?.value;
  };

  return (
    <>
      <div
        className={cn(
          "no-visible-scrollbar relative flex w-full max-w-full flex-row items-center justify-start overflow-auto [perspective:1000px] sm:overflow-visible",
          containerClassName,
        )}
      >
        {propTabs.map((tab, idx) => (
          <button
            key={tab.title}
            onClick={() => {
              moveSelectedTabToTop(idx);
              onTabChange?.(tab.value);
            }}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className={cn(
              "relative mr-2 rounded-md px-4 py-2",
              !isActive(tab) && "bg-primary/5",
              tabClassName,
            )}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {isActive(tab) && (
              <motion.div
                layoutId="clickedbutton"
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                className={cn(
                  "absolute inset-0 rounded-md bg-primary dark:bg-zinc-800",
                  activeTabClassName,
                )}
              />
            )}

            <span
              className={cn(
                "relative flex items-center gap-2 text-sm font-medium",
                isActive(tab)
                  ? "text-white"
                  : "text-primary dark:text-gray-300",
              )}
            >
              {tab?.icon && getIconForKeyword(tab?.icon)}
              {tab.title}
            </span>
          </button>
        ))}
      </div>
      <FadeInDiv
        tabs={tabs}
        active={active!}
        key={active?.value}
        hovering={hovering}
        className={cn("mt-32", contentClassName)}
      />
    </>
  );
};

export const FadeInDiv = ({
  className,
  tabs,
  hovering,
}: {
  className?: string;
  key?: string;
  tabs: Tab[];
  active: Tab;
  hovering?: boolean;
}) => {
  const isActive = (tab: Tab) => {
    return tab.value === tabs[0]?.value;
  };
  return (
    <div className="relative h-full w-full">
      {tabs.map((tab, idx) => (
        <motion.div
          key={tab.value}
          layoutId={tab.value}
          style={{
            scale: 1 - idx * 0.1,
            top: hovering ? idx * -50 : 0,
            zIndex: -idx,
            opacity: idx < 3 ? 1 - idx * 0.1 : 0,
          }}
          animate={{
            y: isActive(tab) ? [0, 40, 0] : 0,
          }}
          className={cn("absolute left-0 top-0 h-full w-full", className)}
        >
          {tab.content}
        </motion.div>
      ))}
    </div>
  );
};
