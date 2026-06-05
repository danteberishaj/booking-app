import {
  Building2,
  Castle,
  Flame,
  Gem,
  Grape,
  Hotel,
  Mountain,
  Palette,
  Sailboat,
  Ship,
  Snowflake,
  Sparkles,
  Sun,
  Tent,
  Tractor,
  TreePalm,
  TreePine,
  Trees,
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
  { value: "Mountain", label: "Mountain", Icon: Mountain },
  { value: "Skiing", label: "Skiing", Icon: Snowflake },
  { value: "Camping", label: "Camping", Icon: Tent },
  { value: "Castles", label: "Castles", Icon: Castle },
  { value: "Mansions", label: "Mansions", Icon: Hotel },
  { value: "Treehouses", label: "Treehouses", Icon: Trees },
  { value: "Boats", label: "Boats", Icon: Ship },
  { value: "Farms", label: "Farms", Icon: Tractor },
  { value: "Vineyards", label: "Vineyards", Icon: Grape },
  { value: "Desert", label: "Desert", Icon: Sun },
];
