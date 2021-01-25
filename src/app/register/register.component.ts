import { Component, OnInit } from '@angular/core';
import { MemberService } from '../services/member.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {
  data: any = {};
  constructor(private memberService: MemberService) { }

  ngOnInit(): void {
  }

  // tslint:disable-next-line: typedef
  addUser() {
    this.memberService.createUser(this.data).subscribe((resp) => {
      if (resp) {
        if (resp.updated) {
          console.log('User created!');
        } else {
          console.log(resp.error);
        }
      } else {
        console.log('Unknown error');
      }
    }, (err) => {
      console.log(err);
    });
  }
}
