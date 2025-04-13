import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User, UserDocument } from '../../users/schemas/user.schema';
import { Tag } from '../../tags/schemas/tag.schema';

// Define the Note schema
@Schema()
class Note {
  @Prop({
    required: [true, 'Note content is required']
  })
  content: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User'
  })
  createdBy: User;

  @Prop({
    default: Date.now
  })
  date: Date;
}

export type TodoDocument = Todo & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class Todo {
  @Prop({
    required: [true, 'A todo must have a title'],
    trim: true,
    maxlength: [100, 'A todo title must have less than 100 characters']
  })
  title: string;

  @Prop({
    trim: true
  })
  description: string;

  @Prop({
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  })
  priority: string;

  @Prop({
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending'
  })
  status: string;

  @Prop({
    default: false
  })
  completed: boolean;

  @Prop()
  dueDate: Date;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Tag' }]
  })
  tags: Tag[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }]
  })
  mentions: UserDocument[];

  @Prop([Note])
  notes: Note[];

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A todo must belong to a user']
  })
  createdBy: UserDocument;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);

// Add indexes for faster queries
TodoSchema.index({ createdBy: 1 });
TodoSchema.index({ mentions: 1 });
TodoSchema.index({ tags: 1 });