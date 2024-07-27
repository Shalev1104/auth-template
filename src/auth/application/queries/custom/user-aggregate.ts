import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

declare module 'typeorm/query-builder/SelectQueryBuilder' {
  interface SelectQueryBuilder<Entity> {
    userAggregate(): SelectQueryBuilder<Entity>;
  }
}

SelectQueryBuilder.prototype.userAggregate = function () {
  return this.leftJoinAndSelect(
    'users.emailAndPasswordLogin',
    'emailAndPasswordLogin',
  )
    .leftJoinAndSelect('users.oAuthLogins', 'oAuthLogins')
    .leftJoinAndSelect(
      'emailAndPasswordLogin.twoFactorAuthentication',
      'twoFactorAuthentication',
    )
    .leftJoinAndSelect('emailAndPasswordLogin.verifications', 'verifications');
};
