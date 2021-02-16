import { Component, OnInit } from '@angular/core';
import { MemberService } from '../services/member.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

  data: any = {};
  newpass = '';
  error = '';
  regexpNumber: RegExp = new RegExp('^[a-zA-Z0-9.,!#]{6,14}$');

  constructor(private memberService: MemberService) { }

  ngOnInit(): void {
  }

  // tslint:disable-next-line: typedef
  resetPassword() {
    this.error = '';
    // tslint:disable-next-line: max-line-length
    if (this.data.enteredPassword.length >= 6 && this.data.enteredPassword.length <= 14 && this.regexpNumber.test(this.data.enteredPassword)) {
      let memberInfo: any = sessionStorage.getItem('memberInfo');
      memberInfo = JSON.parse(memberInfo);
      this.memberService.resetPassword({data: this.data, userInfo: memberInfo}).subscribe((resp) => {
        console.log('Password updated!');
        this.newpass = resp.newPassword;
      }, (err) => {
        console.log(err);
        this.error = err.error.error;
      });
    }
  }

}
