export const convertId = (id: string): string => {
  return id.replaceAll('@', '_').replaceAll(/[\[\].$#]/g, '');
};
