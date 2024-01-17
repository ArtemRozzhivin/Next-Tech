export interface IProviderData {
  providerId: string;
  uid: string;
  displayName: string | null;
  email: string;
  phoneNumber: string | null;
  photoURL: string | null;
}

export interface IUser {
  uid: string;
  email: string;
  providerData: IProviderData[];
  createdAt?: string;
  lastLoginAt?: string;
}
