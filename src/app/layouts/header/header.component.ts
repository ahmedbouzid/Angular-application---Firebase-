import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  email!: string;
  // declaration d'un element de verication
  loggedIn$!: Observable<boolean>;
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.email = JSON.parse(user).email;
    }
    // pour verifier si il est non connect alors cacher le div qui contient le boutton logout et email
    this.loggedIn$ = this.authService.isLoggedIn();
  }
  logout() {
    this.authService.logout();
  }
}
