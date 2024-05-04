export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  metadata: {
    creationTime: string | undefined;
    lastSignInTime: string | undefined;
  };
}
