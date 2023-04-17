import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedGuard!: boolean;
  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(
    private angularFireAuth: AngularFireAuth,
    private toastr: ToastrService,
    private router: Router
  ) {}
  login(email: string, password: string) {
    this.angularFireAuth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        this.toastr.success('Login Succufully');
        this.loadUser();
        this.loggedIn.next(true);
        //le isLoggedGuard est pour controller si le user a un access == est itentifier ou non à l'aide de router Guard
        this.isLoggedGuard = true;
        this.router.navigate(['/']);
      })
      // le pass ou email est incorrect
      .catch((e) => {
        this.toastr.warning(e);
      });
  }
  loadUser() {
    this.angularFireAuth.authState.subscribe((user) => {
      localStorage.setItem('user', JSON.stringify(user));
    });
  }
  logout() {
    this.angularFireAuth.signOut().then(() => {
      this.toastr.success('You logout succufully');
      localStorage.removeItem('user');
      this.loggedIn.next(false);
      this.isLoggedGuard = false;
      this.router.navigate(['/login']);
    });
  }
  isLoggedIn() {
    return this.loggedIn.asObservable();
  }
}
