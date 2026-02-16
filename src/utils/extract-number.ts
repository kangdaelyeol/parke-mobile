export const extractNumber = (val: string) => {
  return val.replace(/[^0-9]/gi, '');
};
