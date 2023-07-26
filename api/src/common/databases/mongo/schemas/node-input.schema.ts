import { Schema, Prop } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

export enum InputTypes {
  text = 'text',
  number = 'number',
  date = 'date',
  radio = 'radio',
}

@Schema()
export abstract class NodeInputSchema {
  @Prop({ type: ObjectId, required: true, unique: true })
  input_id: ObjectId;

  @Prop({
    enum: InputTypes,
    required: true,
  })
  input_type: InputTypes;

  @Prop({ type: String, required: true })
  label: string;

  @Prop({ type: String, required: false })
  placeholder?: string;

  @Prop({
    type: [String],
    required: function (this: NodeInputSchema) {
      return ['radio'].includes(this.input_type);
    },
  })
  options?: string[];
}
