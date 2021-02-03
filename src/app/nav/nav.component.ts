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
  
  loggedIn: boolean = false;
  private subscription: Subscription | undefined;

  constructor(private memberService: MemberService, private router: Router) {

  }

  ngOnInit() {
    this.loggedIn = this.memberService.isLoggedIn();
    this.subscription = this.memberService.loggedIn$.subscribe( isLoggedIn => {
      this.loggedIn = isLoggedIn;
    });
  }

  ngOnDestroy() {
    if (!!this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  logout() {
    this.memberService.logout();
    this.router.navigateByUrl('login');
  }

}
