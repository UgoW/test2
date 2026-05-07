export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'changeMeStrongSecret',
  accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION || '15m',
  refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION || '7d',
};
