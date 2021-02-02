import { Component, OnInit } from '@angular/core';
import { MemberService } from '../services/member.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {

  data: any = {};

  constructor(private memberService: MemberService) { }

  ngOnInit(): void {
  }

  // tslint:disable-next-line: typedef
  updatePassword() {
    let memberInfo: any = localStorage.getItem('memberInfo');
    memberInfo = JSON.parse(memberInfo);
    this.memberService.updatePassword({data: this.data, userInfo: memberInfo}).subscribe((resp) => {
      console.log('Password updated!');
    }, (err) => {
      console.log(err);
    });
  }
}
