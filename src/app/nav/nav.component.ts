import { Component, OnDestroy, OnInit } from '@angular/core';
import { MemberService } from '../services/member.service';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {

  navbarOpen = false;
  loggedIn: string | null = '';
  isAdmin = '';
  private subscription: Subscription | undefined;
  memberService: MemberService;
  constructor(private membService: MemberService, private router: Router) {
    this.memberService = membService;
  }

  // tslint:disable-next-line: typedef
  ngOnInit() {
    if (!!sessionStorage.getItem('loggedIn')) {
      this.loggedIn = sessionStorage.getItem('loggedIn');
      if (sessionStorage.getItem('memberInfo') === 'admin') {
        this.isAdmin = 'true';
      }
    }
  }

  // tslint:disable-next-line: typedef
  ngOnDestroy() {
    if (!!this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // tslint:disable-next-line: typedef
  logout() {
    sessionStorage.setItem('loggedIn', 'false');
    this.memberService.logout();
    this.router.navigateByUrl('login');
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

}
