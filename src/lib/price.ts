export const getPriceInKRW = (amount: number, krw: number) => {
  return Math.round(Number(amount) * krw);
};
