export const SITE_NAME = "Aadi's Intelligence";
export const SITE_DESCRIPTION = "Software engineering, systems programming, and low-level internals.";
export const SITE_URL = process.env.SITE_URL || 'http://home.local';
export const CONTENT_DIR = process.env.CONTENT_DIR || 'content';

export const SESSION_OPTIONS = {
  cookieName: 'admin_session',
  password: process.env.ADMIN_PASSWORD || 'change_this_to_a_secure_password_at_least_32_chars_long',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
  },
};

export const SOCIAL_LINKS = {
  github: process.env.GITHUB_URL || 'https://github.com/aadi',
  twitter: process.env.TWITTER_URL || 'https://x.com/aadi',
  linkedin: process.env.LINKEDIN_URL || 'https://linkedin.com/in/aadi',
};
