export const OTPChannel = {
  Email: 1,
  SMS: 2,
  Call: 3,
  Authenticator: 4,
} as const;
export type OTPChannel = keyof typeof OTPChannel;

const channelNameMap = Object.fromEntries(
  Object.entries(OTPChannel).map(([key, value]) => [value, key]),
);

export function getChannelName(channelId: number) {
  return channelNameMap[channelId];
}
