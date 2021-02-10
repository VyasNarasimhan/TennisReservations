import { Component, OnInit } from '@angular/core';
import { MemberService } from '../services/member.service';
import {Observable} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  allUsers: any = [];
  data: any = {};
  enteredUser = '';

  constructor(private memberService: MemberService, private router: Router) { }

  ngOnInit(): void {
    if (localStorage.getItem('memberInfo') == null) {
      this.router.navigate(['login']);
    }
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        // tslint:disable-next-line: max-line-length
        : this.allUsers.filter((user: { email: string}) => user.email.indexOf(term.toUpperCase()) > -1).slice(0, 10))
    )
}
