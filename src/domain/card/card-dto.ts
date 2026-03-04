export interface CardDto {
  id: string;
  title: string;
  phone: string;
  message: string;
  scan: boolean;
  updatedAt: unknown;
  updatedBy: string;
  deviceId: string;
  ownerList: string[];
}
