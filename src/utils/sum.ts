export const sum = (items: number[]) => {
  return (
    Math.round(items.reduce((partialSum, a) => partialSum + a, 0) * 100) / 100
  );
};
