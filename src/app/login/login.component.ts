import { Component, OnInit } from '@angular/core';
import { MemberService } from '../services/member.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
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
      localStorage.setItem('memberInfo', JSON.stringify(resp.memberInfo));
      localStorage.setItem('allReservations', JSON.stringify(resp.allReservations));
      this.router.navigate(['reservations']);
    }, (err) => {
      console.log(err);
    });
  }

  forgotpwd() {
    this.router.navigate(['forgotpassword']);
  }

}
