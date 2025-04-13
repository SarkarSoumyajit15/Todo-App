import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type TagDocument = Tag & Document;

@Schema({
  timestamps: true
})
export class Tag {
  @Prop({
    required: [true, 'A tag must have a name'],
    unique: true,
    trim: true
  })
  name: string;

  @Prop({
    default: '#e0e0e0'
  })
  color: string;

  @Prop({
    default: '#000000'
  })
  textColor: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User'
  })
  createdBy: User;
}

export const TagSchema = SchemaFactory.createForClass(Tag);