import { GeoAtterbergs } from '@/types/prismaTypes';
import { AtterbergsDTO, AtterbergsResponseDTO, AtterbergsFiltersDTO } from '@/types/dtoTypes';

// Re-export the types for use within the plasticity module
export type Atterbergs = AtterbergsDTO;
export type AtterbergsResponse = AtterbergsResponseDTO;
export type AtterbergsFilters = AtterbergsFiltersDTO;

// Type for raw database records (without calculated latLng)
export type AtterbergsRecord = GeoAtterbergs;
