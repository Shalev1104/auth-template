import { BadRequestException } from '@nestjs/common';

export abstract class ValueObject<T> {
  protected readonly props: T;

  constructor(props: T) {
    this.props = Object.freeze(props);
  }

  equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }

  toString(): string {
    return JSON.stringify(this.props);
  }
  catch?(): void;

  abstract validate(): boolean;

  static createValueObjectOrFail<
    ClassProps,
    Class extends ValueObject<ClassProps>,
  >(VOClass: new (props: ClassProps) => Class, props: ClassProps): Class {
    const vo = new VOClass(props);
    if (!vo.validate()) {
      vo.catch?.();
      throw new BadRequestException(
        `${VOClass.constructor.name} cannot be validated`,
      );
    }
    return vo;
  }
}
