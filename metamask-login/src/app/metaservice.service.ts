import { Injectable } from '@angular/core';
import Web3 from "web3";
declare const window: any;
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MetaserviceService {

  constructor(private _http: HttpClient) { }

  public original_message : string = ""
  public signed_message: string   = ""
  access_token = ""
  public baseUrl: string = "http://localhost:3000"
  public saved_token = new BehaviorSubject<any>(this.access_token);
  private getAccounts = async () => {
    try {
        return await window.ethereum.request({ method: 'eth_accounts' });
    } catch (e) {
        return [];
    }
  }

  public openMetamask = async () => {
    window.web3 = new Web3(window.ethereum);
    let addresses = await this.getAccounts();
    if (!addresses.length) {
        try {
            addresses = await window.ethereum.enable();
        } catch (e) {
            return false;
        }
    }
    return addresses.length ? addresses[0] : null;
  };

  public registerUser = async(payload : any) => {
    return this._http.post(`${this.baseUrl}/register`, payload)
  }

  public signNonceToLogin = async (address: string) =>{
     return this._http.post(`${this.baseUrl}/login`,{ "publicAddress" :  address})
  }

  public verifyLogin = async (payload:any) =>{
    return await this._http.post(`${this.baseUrl}/verify`, payload)

 }

  public async decryptSignedMessage(omsg?: any, dmsg?: any){

    let web3 = new Web3(window.ethereum)
    let accountNumber = await web3.eth.personal.ecRecover(omsg, dmsg)
    return accountNumber
  }

  public setToken(token:string){
    this.saved_token.next(token)
    sessionStorage.setItem("token", token)
  }

  public isLoggedIn(){
    try{
      if(sessionStorage.getItem("token")){
        return true
      }else{
        return false
      }
    }catch{
      return false;
    }   
  }
}
