export const parseDecimal = (n: string): number =>
  parseFloat(n.replace(",", "."));
