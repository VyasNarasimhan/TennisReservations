import { Component, OnInit } from '@angular/core';
import { MemberService } from '../services/member.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  data: any = {};
  constructor(private router: Router, private memberService: MemberService) { }

  ngOnInit(): void {
  }
  // tslint:disable-next-line: typedef
  validateUser() {
    this.memberService.checkUserIsValid(this.data).subscribe((resp) => {
      console.log('User is valid!');
      if (resp.memberInfo !== 'admin') {
        sessionStorage.setItem('memberInfo', JSON.stringify(resp.memberInfo));
        sessionStorage.setItem('allReservations', JSON.stringify(resp.allReservations));
        this.router.navigate(['reservations']);
      } else {
        sessionStorage.setItem('memberInfo', 'admin');
        this.router.navigate(['admin']);
      }
    }, (err) => {
      console.log(err);
    });
  }

  // tslint:disable-next-line: typedef
  forgotpwd() {
    this.router.navigate(['forgotpassword']);
  }

}
