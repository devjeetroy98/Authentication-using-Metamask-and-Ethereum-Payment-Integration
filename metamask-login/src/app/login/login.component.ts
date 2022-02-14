import { Component, OnInit , Injectable} from '@angular/core';
import { MetaserviceService } from "../metaservice.service"
import { FormGroup, FormControl } from '@angular/forms';
import Web3 from "web3";
import { Router } from '@angular/router'
const swal = require('sweetalert')

declare const window: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

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

   ngOnInit(){}

  // TODO : Register User
  public async register(){
    //! Get Name from Form
    let name = this.profileForm.value.name
    //! Get Current active Wallet Address
    let publicAddress = this.address.__zone_symbol__value
    //! API Call for Registration
    ;(await this._service.registerUser({ name, publicAddress})).subscribe((data:any)=>{
      if(data && data?._id)
        swal("Done!", "Registration Successful!", "success");
      else
        swal("Oops!", `Something went wrong!`, "error");
    })
  }

  public original_message : string = ""
  public signed_message: string   = ""
  public acc:any = ""
  public jwt: any = ""

  // TODO : Login User
  public async handleLogin(){
    //! Get Current active Wallet Address
    this.ethAddress = this.address.__zone_symbol__value
    //! API call to get Nonce
    ;(await this._service.signNonceToLogin(this.ethAddress)).subscribe( async (data:any)=>{
      if(data?.nonce){
        //! If Nonce exist in server response
        let web3 = new Web3(window.ethereum)
        //! Ask user for signing the nonce
        let signedMessage = await web3.eth.personal.sign(data.nonce, this.ethAddress , "T53N6Ucx8YzCTQMkIRBl")
        this.original_message = data.nonce
        this.signed_message = signedMessage 
        //! Verify the nonce and user
        ;(await this._service.verifyLogin({ "nonce": data.nonce, "signed_message": signedMessage, publicAddress: this.ethAddress})).subscribe(async (serverResponse :any)=>{
          if(serverResponse.acknowledged){
            let accountNumber = await this._service.decryptSignedMessage(data.nonce, signedMessage)
            if(accountNumber){
              this.acc = accountNumber
              this.jwt = serverResponse.token
              this._service.setToken(serverResponse.token)
              //! Navigate to Dashboard page
              this._router.navigate(['/dashboard'])
  
            }else{
              this.acc = "No user found"
              this.jwt = "Unauthorized"
            }
          }
        })
      }else{
        swal("Oops!", `Something went wrong!`, "error");
      }  
    })
    
  }

}
