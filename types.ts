export enum MainType {
  Tree = 'Tree',
  Bambu = 'Bambu',
  Vine = 'Vine'
}

export enum BambuType {
  BongPa = 'ไผ่บงป่า',
  BongDam = 'ไผ่บงดำ',
  KhaoLam = 'ไผ่ข้าวหลาม',
  RaiPhak = 'ไผ่ไร่และไผ่ผาก'
}

export enum ForestType {
  Rainforest = 'ป่าดิบชื้น/ป่าดิบแล้ง/ป่าดิบเขา',
  Deciduous = 'ป่าเต็งรัง/ป่าเบญจพรรณ',
  Pine = 'ป่าสนเขา',
  Mangrove = 'ป่าชายเลน'
}

export enum MangroveSpecies {
  SamaeKhao = 'แสมขาว',
  SamaeDam = 'แสมดำ',
  TuaKhao = 'ถั่วขาว',
  TuaDam = 'ถั่วดำ',
  Phangka = 'พังกาหัวสุมดอกแดง',
  ProngDaeng = 'โปรงแดง',
  KongKangLek = 'โกงกางใบเล็ก',
  KongKangYai = 'โกงกางใบใหญ่',
  Lamphu = 'ลำพูทะเล',
  TaboonKhao = 'ตะบูนขาว',
  TaboonDam = 'ตะบูนดำ'
}

export enum TreeSize {
  Baby = 'Baby_tree',
  Young = 'Young_tree',
  Big = 'Big_tree',
  None = '-'
}

export interface IndicesInput {
  plotTreeSpecies: number;
  plots: number;
  crossTreeSpecie: number;
  cross: number;
  plantSpecies: number;
  area: number;
}

export interface IndicesResult {
  rf: number;
  rdo: number;
  rp: number;
}

export interface CalculationRecord {
  id: string;
  timestamp: number;
  d: number;
  height: number;
  mainType: MainType;
  bambuType?: BambuType;
  forestType?: ForestType;
  mangroveSpecies?: MangroveSpecies;
  treeSize: TreeSize;
  wt: number; // Biomass
  cn: number; // Carbon of individual tree
  indices?: IndicesResult;
}

export interface UserState {
  email: string | null;
  isAuthenticated: boolean;
}