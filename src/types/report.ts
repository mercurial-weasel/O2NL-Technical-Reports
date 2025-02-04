export interface NavItem {
  id: string;
  name: string;
  date: string;
  coordinates: [number, number];
  data: {
    depth: number[];
    unidentified: number[];
    alluvium: number[];
    colluvium: number[];
    engineered_fill: number[];
    soil: number[];
    noneng_fill: number[];
    not_logged: number[];
    tsoil: number[];
  };
}

export interface Zone {
  id: string;
  name: string;
  color: string;
}

export interface Material {
  id: string;
  name: string;
  color: string;
}