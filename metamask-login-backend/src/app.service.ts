import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
const Web3 = require("web3");
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {

  public web3 : any
  constructor(private jwtService: JwtService , @InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async register(payload : any): Promise<any> {
    let { name, publicAddress } = payload
    if(name){
      let serverResponse = await this.userModel.create({ name, publicAddress})
      return serverResponse
    }else{
      return new UnauthorizedException()
    }
    
  }

  async login(payload : any): Promise<any> {
    let { publicAddress } = payload
    let user = await this.userModel.findOne({ publicAddress }).exec()
    if(user && user._id){
      let text = "";
      let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for(var i = 0; i < 16; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      this.userModel.updateOne({ publicAddress }, { nonce: text }).exec()
      return { publicAddress, nonce: text}
    }else{
      return new NotFoundException()
    }
  }

  signUser(publicAddress : string, userId : string) {
    return this.jwtService.sign({
      sub: userId,
      address: publicAddress
    });
  }

  async verify(payload : any): Promise<any> {
    console.log(payload)
    let { nonce, publicAddress } = payload
    let user = await this.userModel.findOne({ nonce }).exec()
    if(user._id){
      return { "acknowledged" : true, "token" : this.signUser(publicAddress, user._id)}
    }else{
      return  { "acknowledged" : false, "token": "" }
    }
  }
}
