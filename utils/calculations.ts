import { BambuType, ForestType, MainType, MangroveSpecies, TreeSize } from '../types';

export const determineTreeSize = (d: number, h: number): TreeSize => {
  if (d >= 4.5) return TreeSize.Big;
  if (d < 4.5 && h < 1.30) return TreeSize.Baby;
  if (d < 4.5) return TreeSize.Young;
  return TreeSize.None;
};

// Helper for Mangrove Log equations (Assuming base 10 based on notation `Log`)
const calcLogWt = (
  d: number, 
  h: number, 
  coef_s: number[], 
  coef_b: number[], 
  coef_l: number[],
  coef_pr?: number[]
): number => {
  const X = Math.pow(d, 2) * h;
  const logX = Math.log10(X);

  const logWs = coef_s[0] + coef_s[1] * logX;
  const logWb = coef_b[0] + coef_b[1] * logX;
  const logWl = coef_l[0] + coef_l[1] * logX;

  const Ws = Math.pow(10, logWs);
  const Wb = Math.pow(10, logWb);
  const Wl = Math.pow(10, logWl);

  let Wpr = 0;
  if (coef_pr) {
    const logWpr = coef_pr[0] + coef_pr[1] * logX;
    Wpr = Math.pow(10, logWpr);
  }

  return Ws + Wb + Wl + Wpr;
};

export const calculateBiomass = (
  d: number,
  h: number,
  mainType: MainType,
  bambuType?: BambuType,
  forestType?: ForestType,
  mangroveSpecies?: MangroveSpecies
): number => {
  // Vine
  if (mainType === MainType.Vine) {
    return 0.8622 * Math.pow(d, 2.0210);
  }

  // Bambu
  if (mainType === MainType.Bambu && bambuType) {
    switch (bambuType) {
      case BambuType.BongPa:
        return 0.1466 * Math.pow(d, 0.7187);
      case BambuType.BongDam:
        return 0.49522 * Math.pow(d, 0.8726);
      case BambuType.KhaoLam:
        return 0.17466 * Math.pow(d, 1.0437);
      case BambuType.RaiPhak:
        return 0.2425 * Math.pow(d, 1.0751);
      default:
        return 0;
    }
  }

  // General Trees
  if (mainType === MainType.Tree && forestType) {
    const X = Math.pow(d, 2) * h;

    switch (forestType) {
      case ForestType.Rainforest: {
        const Ws = 0.0509 * Math.pow(X, 0.919);
        const Wb = 0.00893 * Math.pow(X, 0.977);
        const Wl = 0.0140 * Math.pow(X, 0.669);
        return Ws + Wb + Wl;
      }
      case ForestType.Deciduous: {
        const Ws = 0.0396 * Math.pow(X, 0.9326);
        const Wb = 0.003487 * Math.pow(X, 1.027);
        const Wtca = Ws + Wb;
        const Wl = Math.pow((28 / Wtca) + 0.025, -1);
        return Ws + Wb + Wl;
      }
      case ForestType.Pine: {
        const Ws = 0.02141 * Math.pow(X, 0.9814);
        const Wb = 0.00002 * Math.pow(X, 1.4561);
        const Wl = 0.00030 * Math.pow(X, 1.0138);
        return Ws + Wb + Wl;
      }
      case ForestType.Mangrove: {
        if (!mangroveSpecies) return 0;
        switch (mangroveSpecies) {
          case MangroveSpecies.SamaeKhao:
            return calcLogWt(d, h, [0.5063, 0.0442], [0.2619, 0.0315], [0.0940, 0.0310]);
          case MangroveSpecies.SamaeDam:
            return calcLogWt(d, h, [0.3389, 0.0570], [0.0775, 0.0403], [0.1119, 0.0392]);
          case MangroveSpecies.TuaKhao:
            return calcLogWt(d, h, [0.4754, 0.0413], [0.4325, 0.0382], [0.1984, 0.0349]);
          case MangroveSpecies.TuaDam:
            return calcLogWt(d, h, [0.3470, 0.458], [0.6811, 0.0659], [0.2965, 0.0393]);
          case MangroveSpecies.Phangka:
            return calcLogWt(d, h, [0.4703, 0.0437], [0.0443, 0.0551], [0.1266, 0.0283]);
          case MangroveSpecies.ProngDaeng:
            return calcLogWt(d, h, [0.2432, 0.0587], [-0.4632, 0.0625], [-0.4187, 0.0529]);
          case MangroveSpecies.KongKangLek:
            return calcLogWt(d, h, [0.8074, 0.0289], [-0.2344, 0.0424], [-0.682, 0.0277], [-0.7566, 0.0311]);
          case MangroveSpecies.KongKangYai:
            return calcLogWt(d, h, [0.6171, 0.0357], [-0.3606, 0.0467], [-0.3778, 0.0360], [-0.6908, 0.0496]);
          case MangroveSpecies.Lamphu:
            return calcLogWt(d, h, [0.2520, 0.0507], [-0.3567, 0.0449], [-0.4976, 0.0418]);
          case MangroveSpecies.TaboonKhao:
            return calcLogWt(d, h, [0.2374, 0.0589], [-0.5046, 0.0637], [-0.5179, 0.0558]);
          case MangroveSpecies.TaboonDam:
            return calcLogWt(d, h, [0.2572, 0.0566], [-0.7659, 0.0562], [-0.7823, 0.0511]);
          default:
            return 0;
        }
      }
      default:
        return 0;
    }
  }

  return 0;
};
