import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {

  @Prop({ default : "User"})
  name: string;

  @Prop({ required: true })
  publicAddress: string;

  @Prop()
  nonce: string;
}

export const UserSchema = SchemaFactory.createForClass(User);