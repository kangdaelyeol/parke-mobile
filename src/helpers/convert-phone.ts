export const convertPhone = (num: string): string => {
  const numExtacted = num.replace(/\D/g, '');

  if (numExtacted.length >= 4 && numExtacted.length <= 6) {
    return numExtacted.replace(/(\d{3})(\d{1,3})/, '$1-$2');
  } else if (numExtacted.length >= 7 && numExtacted.length <= 9) {
    return numExtacted.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1-$2-$3');
  } else if (numExtacted.length >= 10)
    return numExtacted.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
  else return numExtacted;
};
