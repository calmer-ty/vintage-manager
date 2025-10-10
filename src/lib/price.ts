export const getPriceInKRW = (amount: string, krw: number) => {
  return Math.round(Number(amount) * krw);
};
