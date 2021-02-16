import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MemberService } from '../services/member.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {

  data: any = {};
  error = '';
  inputErrors = '';
  regexpNumber: RegExp = new RegExp('^[a-zA-Z0-9.,!#]{6,14}$');

  constructor(private memberService: MemberService, private router: Router) { }

  ngOnInit(): void {
  }

  // tslint:disable-next-line: typedef
  validateConfirmPassword() {
    if (this.data.enteredPassword !== this.data.confirmPassword) {
      this.inputErrors = 'Confirm Password needs to match';
    } else {
      this.inputErrors = '';
    }
  }

  // tslint:disable-next-line: typedef
  updatePassword() {
    // tslint:disable-next-line: max-line-length
    if (this.data.confirmPassword === this.data.enteredPassword && this.data.enteredPassword.length >= 6 && this.data.enteredPassword.length <= 14 && this.regexpNumber.test(this.data.enteredPassword)) {
      let memberInfo: any = sessionStorage.getItem('memberInfo');
      memberInfo = JSON.parse(memberInfo);
      this.memberService.updatePassword({data: this.data, userInfo: memberInfo}).subscribe((resp) => {
        console.log('Password updated!');
        this.router.navigate(['reservations']);
      }, (err) => {
        console.log(err);
        this.error = err.error.error;
      });
    }
  }
}
