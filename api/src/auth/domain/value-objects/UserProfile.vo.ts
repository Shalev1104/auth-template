import { ValueObject } from '@common/ddd/value-object';

export interface IUserProfile {
  readonly firstName: string;
  readonly lastName: string;
  // avatarImageUrl: string; ** TODO configure file uploads with S3
}

export class UserProfile extends ValueObject<IUserProfile> {
  constructor(props: IUserProfile) {
    super(props);
  }

  validate() {
    return true;
  }

  get firstName() {
    return this.props.firstName;
  }

  get lastName() {
    return this.props.lastName;
  }

  get displayName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
