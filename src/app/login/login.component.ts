import { Component, OnInit } from '@angular/core';
import { MemberService } from '../services/member.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  data: any = {};
  constructor(private memberService: MemberService) { }

  ngOnInit(): void {
  }
  // tslint:disable-next-line: typedef
  validateUser() {
    this.memberService.checkUserIsValid(this.data).subscribe((resp) => {
      if (resp.length === 1) {
        console.log('User is valid!');
      } else {
        console.log('Could not find email or password');
      }
    }, (err) => {
      console.log(err);
    });
  }

}
