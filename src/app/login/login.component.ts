import { Component, OnInit, Output } from '@angular/core';
import { MemberService } from '../services/member.service';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  data: any = {};
  error = '';
  inputErrors = '';
  email = new FormControl('', [Validators.required, Validators.email]);
  constructor(private router: Router, private memberService: MemberService) { }

  ngOnInit(): void {
  }
  // tslint:disable-next-line: typedef
  validateUser() {
    this.error = '';
    if (this.inputErrors !== '' && this.data.enteredPassword && this.data.enteredEmail) {
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
        this.error = err.error.error;
      });
    }
  }

  // tslint:disable-next-line: typedef
  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      this.inputErrors = 'Email is required';
      return 'Email is required';
    } else {
      this.inputErrors =  '';
    }
    this.inputErrors = this.email.hasError('email') ? 'Not a valid email' : '';
    return this.inputErrors;
  }

  // tslint:disable-next-line: typedef
  forgotpwd() {
    this.router.navigate(['forgotpassword']);
  }

}
