import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { NodeSchema } from './node.schema';

@Schema({ versionKey: false, collection: 'tree_nodes' })
export class TreeNodes {
  @Prop({ type: String, required: true, unique: true })
  tree_id: string;

  @Prop({ type: String, required: false, unique: true })
  version?: string;

  @Prop({
    type: NodeSchema,
    required: true,
  })
  data: NodeSchema;
}

export type TreeNodesDocument = mongoose.HydratedDocument<TreeNodes>;
export const TreeNodesSchema = SchemaFactory.createForClass(TreeNodes);
