
import { Cookie } from './dataTypes';

export interface CookieContextType {
  cookies: Cookie[];
  addCookie: (cookie: Omit<Cookie, 'id'>) => Promise<Cookie>;
  updateCookie: (cookie: Cookie) => Promise<Cookie>;
  deleteCookie: (id: string) => Promise<void>;
  getCookiesForPlan: (planId: string) => Promise<Cookie[]>;
  togglePinnedStatus: (id: string) => Promise<Cookie>;
}
