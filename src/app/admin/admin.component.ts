import { Component, OnInit } from '@angular/core';
import { MemberService } from '../services/member.service';
import { Router } from '@angular/router';
import {  HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  memberFromDb: any;
  loadError = '';
  data: any = {};

  constructor(private memberService: MemberService, private router: Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('memberInfo') == null) {
      this.router.navigate(['login']);
    }
  }

  // tslint:disable-next-line: typedef
  searchForUser() {
    this.data.enteredEmail = this.data.enteredEmail.toUpperCase();
    this.memberService.findMemberByEmail(this.data).subscribe((resp) => {
      this.memberFromDb = resp.user;
    }, (err) => {
      console.log(err);
      this.loadError = err;
    });
  }

}
