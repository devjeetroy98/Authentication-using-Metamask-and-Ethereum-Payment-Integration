import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';

import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor( @InjectModel(User.name) private userModel: Model<UserDocument> ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET
    });
  }

  async validate(payload: any) {

    let userIdFromJWT = payload.sub
    let data = await this.userModel.find({ userid : userIdFromJWT }).select({ "name": 1, "userid": 1, "_id": 0}).exec();
    if(data[0]){
      return payload;
    }else{
      return false
    }
  }
}