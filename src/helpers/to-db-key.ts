export const toDbKey = (email: string) => {
  return email
    .toLowerCase()
    .replaceAll('@', '_')
    .replaceAll(/[\\\.\$\#\[\]\/]/g, '_');
};
