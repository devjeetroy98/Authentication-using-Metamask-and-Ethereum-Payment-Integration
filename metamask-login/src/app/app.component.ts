import { Component, Injectable } from '@angular/core';
import { MetaserviceService } from "./metaservice.service"
import { FormGroup, FormControl } from '@angular/forms';
import Web3 from "web3";
import { Router } from '@angular/router'
declare const window: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'metamask-login';

  public address : any = ""
  public ethAddress : any = ""
  public profileForm : any = null
  constructor(private _service : MetaserviceService, private _router : Router) {
    let address :any = this._service.openMetamask()
    this.address = address
    this.profileForm = new FormGroup({
      name: new FormControl(''),
    });
   }

  public async register(){
    let name = this.profileForm.value.name
    let publicAddress = this.address.__zone_symbol__value
    ;(await this._service.registerUser({ name, publicAddress})).subscribe((data:any)=>{
      console.log("RESPONSE AF REGISTER: ", data)
    })
  }

  public original_message : string = ""
  public signed_message: string   = ""
  public acc:any = ""
  public jwt: any = ""
  public async handleLogin(){
    this.ethAddress = this.address.__zone_symbol__value
    console.log(this.ethAddress)
    ;(await this._service.signNonceToLogin(this.ethAddress)).subscribe( async (data:any)=>{
      let web3 = new Web3(window.ethereum)
      let signedMessage = await web3.eth.personal.sign(data.nonce, this.ethAddress , "T53N6Ucx8YzCTQMkIRBl")
      this.original_message = data.nonce
      this.signed_message = signedMessage 
      console.log({ "nonce": data.nonce, "signed_message": signedMessage})
      ;(await this._service.verifyLogin({ "nonce": data.nonce, "signed_message": signedMessage, publicAddress: this.ethAddress})).subscribe(async (serverResponse :any)=>{
        if(serverResponse.acknowledged){
          let accountNumber = await this._service.decryptSignedMessage(data.nonce, signedMessage)
          if(accountNumber){
            this.acc = accountNumber
            this.jwt = serverResponse.token
            this._router.navigate(['/dashboard'])

          }else{
            this.acc = "No user found"
            this.jwt = "Unauthorized"
          }
        }
      })
    })
    
  }
}
