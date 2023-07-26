import { Schema, Prop } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

@Schema()
export abstract class NodeFileSchema {
  @Prop({ type: ObjectId, required: true, unique: true })
  file_id: ObjectId;

  @Prop({ type: String, required: true })
  name: string;
}
