import { User } from '@/types/auth';

export const DEFAULT_CREDENTIALS = {
  email: `user-${Date.now()}@domain.com`,
  password: `temp-${Date.now()}`,
  uid: `user-${Date.now()}`,
  displayName: `User-${Date.now()}`,
};

export const getDefaultUser = (): User => {
  return {
    uid: DEFAULT_CREDENTIALS.uid,
    email: DEFAULT_CREDENTIALS.email,
    displayName: DEFAULT_CREDENTIALS.displayName,
    photoURL: null,
    emailVerified: false
  };
};