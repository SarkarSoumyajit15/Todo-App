import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as validator from 'validator';

// export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class User {
//   @Prop()
//   _id: MongooseSchema.Types.ObjectId;

  @Prop({
    required: [true, 'Please provide a name'],
    trim: true
  })
  name: string;

  @Prop({
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: 'Please provide a valid email'
    }
  })
  email: string;

  @Prop({
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  })
  password: string;

  @Prop({
    default: function(this: User) {
      return `https://ui-avatars.com/api/?name=${this.name.replace(/\s+/g, '+')}&background=random`;
    }
  })
  avatar: string;

  @Prop({
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true
  })
  username: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Todo' }]
  })
  assigned_todos: MongooseSchema.Types.ObjectId[];

  @Prop({
    default: Date.now
  })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add virtual field for todos
UserSchema.virtual('todos', {
  ref: 'Todo',
  localField: '_id',
  foreignField: 'createdBy'
});
// Hash password before saving
UserSchema.pre('save', async function(next) {
  // Only run if password is modified
  if (!this.isModified('password')) return next();
  
  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check if password is correct
UserSchema.methods.correctPassword = async function(candidatePassword: string, userPassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword); 
}
// Add this interface to define the methods available on the User document
export interface UserDocument extends User , Document {
   _id: MongooseSchema.Types.ObjectId;
  correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
  toObject(): Record<string, any>;
}
