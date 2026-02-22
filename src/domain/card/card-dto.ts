export interface CardDto {
  id: string;
  title: string;
  phone: string;
  message: string;
  autoChange: boolean;
  updatedAt: unknown;
  updatedBy: string;
  deviceId: string;
  ownerList: string[]
}
