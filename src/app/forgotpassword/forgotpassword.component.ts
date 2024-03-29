import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MemberService } from '../services/member.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

  data: any = {};
  error = '';
  email = new FormControl('', [Validators.required, Validators.email]);
  inputErrors = '';
  successMessage = '';

  constructor(private memberService: MemberService, private router: Router) { }

  ngOnInit(): void {
  }

  // tslint:disable-next-line: typedef
  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      this.inputErrors = 'Email is required';
      return 'Email is required';
    } else {
      this.inputErrors = '';
    }
    this.inputErrors = this.email.hasError('email') ? 'Not a valid email' : '';
    return this.inputErrors;
  }

  // tslint:disable-next-line: typedef
  resetPassword() {
    this.error = '';
    // tslint:disable-next-line: max-line-length
    if (this.data.enteredEmail && !this.inputErrors) {
      let memberInfo: any = sessionStorage.getItem('memberInfo');
      memberInfo = JSON.parse(memberInfo);
      this.memberService.resetPassword({data: this.data, userInfo: memberInfo}).subscribe((resp) => {
        console.log('Password updated!');
        this.successMessage = 'Email has been sent';
      }, (err) => {
        console.log(err);
        this.error = err.error.error;
      });
    }
  }

  // tslint:disable-next-line: typedef
  login() {
    this.router.navigate(['login']);
  }

}
