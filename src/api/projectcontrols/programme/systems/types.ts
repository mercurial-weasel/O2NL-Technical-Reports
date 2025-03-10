export type SystemStatus = 'operational' | 'maintenance' | 'degraded' | 'outage' | 'not-started';
export type BusinessArea = '00 - Commercial' | '01 - Design' | '02 - Engineering' | '03 - IT' | '04 - Fitout' | '05 - Environmental' | '06 - HSEQ' | '07 - Stakeholder' | '09 - Home Org' | '10 - Project Controls';
export type Phase = '0 - IPAA' | '1- PAA' | '2 - IPAA + PAA';
export type Requirement = '0 - Must have' | '1 - Would Have' | '2 - Could Have' | '3 - Wont Have' | '9 - Unknown';
export type Adoption = '1 - poor' | '2 - average' | '3 - good' | '4 - very good' | '5 - comprehensive' | '7 - Unknown' | '8 - Not commenced' | '9 - N/A';
export type HostedBy = 'Third Party' | 'MacDow' | 'T+T' | 'NZTA' | 'Beca' | 'Home Org' | 'Unknown';

export interface SystemData {
  BusinessArea: BusinessArea;
  Category: string;
  System: string;
  Purpose: string;
  Requirement: Requirement;
  Phase: Phase;
  Licence: string;
  SMEResponsible: string;
  ProjectRole: string;
  Adoption: Adoption;
  HostedBy: HostedBy;
}