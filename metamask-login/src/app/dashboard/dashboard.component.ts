import { Component, OnInit } from '@angular/core';
import Web3 from "web3";
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MetaserviceService } from '../metaservice.service';
const swal = require('sweetalert')
import { Router } from '@angular/router'


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

  public transactionForm:FormGroup
  constructor(private _fb : FormBuilder, private _service : MetaserviceService, private _router : Router) {
    this.transactionForm = this._fb.group({
      address : [""],
      amount: [""]
    });
   }
   ngOnInit(){}

   public dollarToEth:number = 0.00035

   // TODO: Send Ether to another wallet address
   public async sendMoney(){
    let { address, amount } = this.transactionForm.value
    //! Get amount into integer format
    amount = parseInt(amount)
    //! Convert USD => ETH
    let payableEther = this.dollarToEth * amount
    let web3 = new Web3(Web3.givenProvider)
    let sender :any = this._service.openMetamask()
    let publicAddress = await sender
    //! Request Transaction
    const response = await web3.eth.sendTransaction({
      to: address,
      value: web3.utils.toWei(String(payableEther), 'ether'),
      from: publicAddress
    })
    if(response.transactionHash){
      //! If transaction is successful
      swal("Done!", `Payment Successful! Transaction Hash : ${response.transactionHash}`, "success");
    }else{
      //! If transaction fails
      swal("Oops!", `Something went wrong!`, "error");
    }
   }

   //! TODO : LogOut User
   public signOut(){
     try{
       sessionStorage.removeItem("token")
       this._router.navigate(['/login'])
     }catch{
        this._router.navigate(['/login'])
     }
   }
}
