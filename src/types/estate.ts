export type Language = 'ku' | 'ar' | 'en';

export type PropertyCategory = 'all' | 'apartment' | 'house' | 'villa';

export type PropertyKind = 'apartment' | 'house' | 'villa';

export type NeighborhoodId =
  | 'all'
  | 'Empire World'
  | 'Dream City'
  | 'Pavilion'
  | 'Ankawa'
  | 'Italian Village'
  | 'Park View'
  | '120m Blvd'
  | 'English Village'
  | 'Gulan';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'area-desc';

export interface LocalizedText {
  ku: string;
  ar: string;
  en: string;
}

export interface GalleryMedia {
  url: string;
  caption: LocalizedText;
  tag: LocalizedText;
}

export interface FloorPlanDoor {
  x: number;
  y: number;
  r: number;
  orientation: 'ne' | 'nw' | 'se' | 'sw';
}

export interface FloorPlanWindow {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface FloorPlanRoom {
  id: string;
  name: LocalizedText;
  dimensions: string;
  areaSqm: number;
  floor: LocalizedText;
  x: number;
  y: number;
  width: number;
  height: number;
  kind: 'living' | 'kitchen' | 'bedroom' | 'master' | 'bath' | 'terrace' | 'pool' | 'courtyard' | 'dining' | 'office' | 'garage';
}

export interface FloorPlanData {
  viewBox: string;
  footprintRect: { x: number; y: number; width: number; height: number };
  blueprintCode: string;
  orientationLabel: string;
  rooms: FloorPlanRoom[];
  doors: FloorPlanDoor[];
  windows: FloorPlanWindow[];
}

export type ArchitecturalArchetype = 'penthouse' | 'apartment' | 'house' | 'courtyard-house' | 'pool-villa' | 'lagoon-villa';

export interface Property3DConfig {
  archetype: ArchitecturalArchetype;
  floors: number;
  hasPool: boolean;
  hasLagoon: boolean;
  hasCourtyard: boolean;
  primaryColor: string;
  accentColor: string;
  footprintScale: [number, number];
}

export interface PanoramaHotspot {
  id: string;
  targetRoomId: string;
  label: LocalizedText;
  yawDeg: number;
  pitchPercent: number;
}

export interface PanoramaRoom {
  id: string;
  name: LocalizedText;
  imageUrl: string;
  initialYaw: number;
  hotspots: PanoramaHotspot[];
}

export interface PropertyListing {
  id: string;
  code: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  category: PropertyKind;
  typeDisplay: LocalizedText;
  neighborhood: Exclude<NeighborhoodId, 'all'>;
  neighborhoodLabel: LocalizedText;
  priceUsd: number;
  areaSqm: number;
  builtUpSqm: number;
  beds: number;
  baths: number;
  floors: number;
  parking: number;
  yearBuilt: number;
  furnishing: LocalizedText;
  smartHome: LocalizedText;
  featuredRank: number;
  description: LocalizedText;
  highlights: LocalizedText[];
  gallery: GalleryMedia[];
  floorPlan: FloorPlanData;
  threeD: Property3DConfig;
  panoramaRooms: PanoramaRoom[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
