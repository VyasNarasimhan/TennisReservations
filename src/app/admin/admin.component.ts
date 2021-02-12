import { Component, OnInit } from '@angular/core';
import { MemberService } from '../services/member.service';
import { Router } from '@angular/router';
import {  HttpErrorResponse } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';

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
      this.memberFromDb.userRole = resp.role.rolename;
    }, (err) => {
      console.log(err);
      this.loadError = err;
    });
  }

  // tslint:disable-next-line: typedef
  changeRole() {
    this.memberService.changeRole(this.memberFromDb).subscribe((resp) => {
      this.memberFromDb.userRole = resp.role;
    }, (err) => {
      console.log(err);
      this.loadError = err;
    });
  }

}
