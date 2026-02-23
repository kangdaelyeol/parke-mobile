export const toIdList = (obj: any): string[] => {
  const idList = [] as string[];
  obj.values((v: string) => idList.push(v));
  return idList;
};
