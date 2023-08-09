import { ValueObject } from '@common/ddd/value-object';
import { AuthStrategy } from '@common/http/user';
import { Email } from './Email.vo';
import { HashedPassword } from './HashedPassword.vo';

interface LocalCredentials {
  readonly email: Email;
  readonly hashedPassword: HashedPassword;
  readonly authStrategy: AuthStrategy.Local;
}

type ExternalStrategies = AuthStrategy.Google | AuthStrategy.Facebook;
interface ExternalCredentials {
  readonly email: Email;
  readonly authStrategy: ExternalStrategies;
}

type IAuthCredentials<S> = S extends ExternalStrategies
  ? ExternalCredentials
  : LocalCredentials;

export class AuthCredentials<Strategy extends AuthStrategy> extends ValueObject<
  IAuthCredentials<Strategy>
> {
  constructor(props: IAuthCredentials<Strategy>) {
    super(props);
  }

  validate() {
    return this.validateEmail() && this.validatePassword();
  }

  private validateEmail() {
    return this.props.email.validate();
  }

  private validatePassword() {
    if (this.props.authStrategy === AuthStrategy.Local)
      return this.props.hashedPassword.validate();
    return true;
  }

  get email(): Email {
    return this.props.email;
  }

  get strategy(): AuthStrategy {
    return this.props.authStrategy;
  }

  /*
    Conditional getter that should be called only
    for local users since they store password information
  */
  get hashedPassword(): Strategy extends AuthStrategy.Local
    ? HashedPassword
    : never {
    if (this.props.authStrategy === AuthStrategy.Local) {
      return this.props.hashedPassword as Exclude<
        Strategy,
        AuthStrategy.Local
      > extends AuthStrategy.Local
        ? HashedPassword
        : never;
    }
    throw new Error('password are not available for external strategies.');
  }
}
