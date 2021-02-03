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

  constructor(private memberService: MemberService) { }

  ngOnInit(): void {
  }

  // tslint:disable-next-line: typedef
  resetPassword() {
    let memberInfo: any = localStorage.getItem('memberInfo');
    memberInfo = JSON.parse(memberInfo);
    this.memberService.resetPassword({data: this.data, userInfo: memberInfo}).subscribe((resp) => {
      console.log('Password updated!');
      this.newpass = resp.newPassword;
    }, (err) => {
      console.log(err);
    });
  }

}
