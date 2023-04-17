import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toasts: ToastrService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    /// verifie si le guard est true ou false pour donne le chemin d'acces precis
    if (this.authService.isLoggedGuard) {
      console.log('Access Gratted:::::');

      return true;
    } else {
      this.toasts.warning('You Dont Have Access Please Login');
      console.warn('Access Refused::::');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
