export const sum = (items: number[]) => {
  return items.reduce((partialSum, a) => partialSum + a, 0);
};
