import { Schema, Prop } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

enum Operators {
  EQUALS = '=',
  NOT_EQUALS = '<>',
  IN = 'in',
  LESS_THAN = '<',
  LESS_THAN_OR_EQUAL = '<=',
  GREATER_THAN = '>',
  GREATER_THAN_OR_EQUAL = '>=',
}

enum BranchingLogicType {
  AND = 'AND',
  OR = 'OR',
}

@Schema()
class ConditionSchema {
  @Prop({ type: ObjectId, required: true })
  input_id: ObjectId;

  @Prop({
    enum: Object.values(Operators),
    required: true,
  })
  operator: Operators;

  @Prop({ required: true })
  value: string | number | Date;
}

@Schema()
export abstract class NodeBranchingLogicSchema {
  @Prop({ required: true, enum: BranchingLogicType })
  type: BranchingLogicType;

  @Prop({ required: true, type: [ConditionSchema, NodeBranchingLogicSchema] })
  conditions: (ConditionSchema | NodeBranchingLogicSchema)[];
}
