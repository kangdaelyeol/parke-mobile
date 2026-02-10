export const convertId = (id: string): string => {
  return id.replaceAll('@', '_').replace(/[.#$\\[\]/]/g, '');
};
