import { Component, OnDestroy, OnInit } from '@angular/core';
import { MemberService } from '../services/member.service';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Subscription } from 'rxjs';
import { MyreservationsComponent } from '../myreservations/myreservations.component';
import { FeedbackComponent } from '../feedback/feedback.component';


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
  constructor(private membService: MemberService, private router: Router, private ngbModal: NgbModal) {
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

  // tslint:disable-next-line: typedef
  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  // tslint:disable-next-line: typedef
  launchMyReservationsModal() {
    const resModal = this.ngbModal.open(MyreservationsComponent);
  }

  // tslint:disable-next-line: typedef
  launchFeedbackModal() {
    const feedModal = this.ngbModal.open(FeedbackComponent);
  }
}
