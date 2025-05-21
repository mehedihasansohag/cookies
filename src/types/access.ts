
export interface Platform {
  id: string;
  name: string;
  url?: string;
  domain?: string;
}

export interface Credential {
  id: string;
  platform: string;
  username: string;
  password: string;
  planId: string;
  domain?: string;
  updatedAt?: string;
}

export interface Cookie {
  id: string;
  platform: string;
  domain?: string;
  cookieData: string;
  updatedAt: string;
  planId: string;
}

export interface TutorialVideo {
  id: string;
  title: string;
  description: string;
  contentUrl: string;
  thumbnailUrl?: string;
  type: 'login' | 'cookie' | 'login-mobile' | 'cookie-mobile';
}

export interface TutorialVideoProps {
  title: string;
  description: string;
  contentLabel: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  deviceType?: 'desktop' | 'mobile';
}

export interface ExtensionStatusProps {
  status: string;
}

export interface ImportantNotesProps {
  extensionInstalled: boolean;
}

export interface ExtensionBannerProps {
  extensionInstalled: boolean;
  hasCookies: boolean;
  activeTab: string;
}

export interface LoginCredentialsProps {
  credentials: Credential[];
  getPlatformUrl: (platformName?: string) => string;
  showTutorials: boolean;
  onToggleShowTutorials: () => void;
}

export interface CookieCredentialsProps {
  cookies: Cookie[];
  extensionInstalled: boolean;
  handleDirectAccess: (cookie: Cookie) => void;
  formatDate: (dateString: string) => string;
  copyToClipboard: (text: string, type: string) => void;
  showTutorials: boolean;
  onToggleShowTutorials: () => void;
}

export interface EmptyAccessContentProps {
  isLoading: boolean;
  plan: any;
  order: any;
}

export interface CopyButtonProps {
  text: string;
  type: string;
  onCopy: (text: string, type: string) => void;
  className?: string;
}
