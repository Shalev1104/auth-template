import { ValueObject } from '@common/ddd/value-object';

export interface IUserProfile {
  readonly name: string;
  avatarImageUrl?: string; // ** TODO configure file uploads with S3
}

export class UserProfile extends ValueObject<IUserProfile> {
  constructor(props: IUserProfile) {
    super(props);
  }

  validate() {
    return true;
  }

  get name() {
    return this.props.name;
  }

  get avatarImageUrl() {
    return this.props.avatarImageUrl;
  }
}
