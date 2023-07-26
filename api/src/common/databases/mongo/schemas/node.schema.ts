import { Schema, Prop } from '@nestjs/mongoose';
import { NodeInputSchema } from './node-input.schema';
import { NodeFileSchema } from './node-file.schema';
import { NodeBranchingLogicSchema } from './branching-logic.schema';
import { NodeMessageSchema } from './node-message.schema';

@Schema()
export abstract class NodeSchema {
  @Prop({ type: String, required: true, unique: true })
  node_id: string;

  @Prop([
    {
      type: [NodeBranchingLogicSchema],
      required: true,
    },
  ])
  branching_logics: NodeBranchingLogicSchema[];

  @Prop({ type: String, required: true })
  entry_option: string;

  @Prop({
    type: [NodeMessageSchema, NodeInputSchema, NodeFileSchema],
    required: true,
  })
  messages: (NodeMessageSchema | NodeInputSchema | NodeFileSchema)[];

  @Prop([
    [
      {
        type: [NodeSchema],
        required: true,
      },
    ],
  ])
  children: NodeSchema[];
}
