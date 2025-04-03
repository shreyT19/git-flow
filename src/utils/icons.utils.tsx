import { ReactElement } from "react";
import {
  Plus,
  Workflow,
  ExternalLink,
  SaveIcon,
  Github,
  X,
  PanelRight,
  PanelLeft,
  ChevronDown,
  ChevronUp,
  GripVertical,
  MoreHorizontal,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  InfoIcon,
  Circle,
  Minus,
  Search,
  VideoIcon,
  Loader2,
  EyeOff,
  RefreshCw,
  Dot,
  Pencil,
  Trash,
  UserPlus,
} from "lucide-react";

export const iconMap = {
  plus: <Plus />,
  userPlus: <UserPlus />,
  workflow: <Workflow />,
  externalLink: <ExternalLink />,
  save: <SaveIcon />,
  github: <Github />,
  x: <X />,
  panelLeft: <PanelLeft />,
  panelRight: <PanelRight />,
  chevronRight: <ChevronRight />,
  chevronLeft: <ChevronLeft />,
  chevronUp: <ChevronUp />,
  chevronDown: <ChevronDown />,
  gripVertical: <GripVertical />,
  moreHorizontal: <MoreHorizontal />,
  moreVertical: <MoreVertical />,
  infoIcon: <InfoIcon />,
  circle: <Circle />,
  minus: <Minus />,
  arrowLeft: <ArrowLeft />,
  arrowRight: <ArrowRight />,
  arrowUp: <ArrowUp />,
  arrowDown: <ArrowDown />,
  search: <Search />,
  video: <VideoIcon />,
  loader2: <Loader2 />,
  eyeOff: <EyeOff />,
  refresh: <RefreshCw />,
  dot: <Dot />,
  edit: <Pencil />,
  trash: <Trash />,
} as const;

export type IconType = keyof typeof iconMap;

export const fallbackIcon = ":/";

export const getIconForKeyword = (
  keyword: IconType | ReactElement,
  className?: string,
) => {
  if (typeof keyword !== "string") return keyword;
  if (typeof keyword === "string" && keyword in iconMap) {
    return <span className={`${className}`}>{iconMap[keyword]}</span>;
  }
  return fallbackIcon;
};

export const stylingChildSVG = {
  stroke: "[&>svg]:stroke-[2.5]",
  size: {
    small: "[&_svg]:w-[13px] [&_svg]:h-[13px]",
    medium: "[&_svg]:w-[15px] [&_svg]:h-[15px]",
    large: "[&_svg]:w-[16px] [&_svg]:h-[16px]",
    extraSmall: "[&_svg]:w-[11px] [&_svg]:h-[11px]",
  },
};
