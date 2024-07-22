export const OAuthProvider = {
  Google: 'Google',
  Facebook: 'Facebook',
  Github: 'Github',
} as const;
export type OAuthProvider = keyof typeof OAuthProvider;
