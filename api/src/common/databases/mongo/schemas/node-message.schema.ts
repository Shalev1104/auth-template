import { Schema, Prop } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

@Schema()
export abstract class NodeMessageSchema {
  @Prop({ type: ObjectId, required: true, unique: true })
  msg_id: ObjectId;

  @Prop({ type: String, required: true })
  value: string;
}
