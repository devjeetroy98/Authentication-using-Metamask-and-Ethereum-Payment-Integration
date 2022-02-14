import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MetaserviceService } from "./metaservice.service"
const swal = require('sweetalert')
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private _service: MetaserviceService, private _router : Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if(this._service.isLoggedIn()){
      return true
    }else{
      swal("Sorry!", `You are not an authorized user!`, "error");
      this._router.navigate(['/login'])
      return false
    }
  }
  
}
