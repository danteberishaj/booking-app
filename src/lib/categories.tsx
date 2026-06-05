import {
  Building2,
  Flame,
  Gem,
  Palette,
  Sailboat,
  Sparkles,
  TreePalm,
  TreePine,
  Waves,
  Wheat,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "./types";

export interface CategoryOption {
  value: Category | "All";
  label: string;
  Icon: LucideIcon;
}

/** Category chips shown in the home filter bar, in display order. */
export const CATEGORY_OPTIONS: CategoryOption[] = [
  { value: "All", label: "All", Icon: Sparkles },
  { value: "Trending", label: "Trending", Icon: Flame },
  { value: "Beachfront", label: "Beachfront", Icon: Waves },
  { value: "Cabins", label: "Cabins", Icon: TreePine },
  { value: "City", label: "City", Icon: Building2 },
  { value: "Countryside", label: "Countryside", Icon: Wheat },
  { value: "Lakefront", label: "Lakefront", Icon: Sailboat },
  { value: "Design", label: "Design", Icon: Palette },
  { value: "Tropical", label: "Tropical", Icon: TreePalm },
  { value: "Luxe", label: "Luxe", Icon: Gem },
];
