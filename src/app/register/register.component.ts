import { Component, OnInit } from '@angular/core';
import { MemberService } from '../services/member.service';
import { Router } from '@angular/router';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  data: any = {};
  error = '';
  inputErrors = '';
  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  constructor(private memberService: MemberService, private router: Router) { }

  ngOnInit(): void {
    this.memberService.getResidentId().subscribe((resp) => {
      this.data.role = resp.residentId.id;
    });
  }

  // tslint:disable-next-line: typedef
  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Email is required';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  // tslint:disable-next-line: typedef
  validateConfirmPassword() {
    if (this.data.enteredPassword !== this.data.confirmPassword) {
      this.inputErrors = 'Confirm Password needs to match';
    }
  }

  // tslint:disable-next-line: typedef
  addUser() {
    this.error = '';
    if (!this.inputErrors) {
      this.memberService.createUser(this.data).subscribe((resp) => {
        if (resp) {
          if (resp.updated) {
            console.log('User created!');
            this.router.navigate(['login']);
          } else {
            console.log(resp.error);
          }
        } else {
          console.log('Unknown error');
        }
      }, (err) => {
        console.log(err);
        this.error = err.error.error;
      });
    }
  }
}
