import { Component, OnInit } from '@angular/core';
import { MemberService } from '../services/member.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  data: any = {};
  constructor(private memberService: MemberService, private router: Router) { }

  ngOnInit(): void {
    // fetch coach and user roles from the db and use those to set the value of the select
  }

  // tslint:disable-next-line: typedef
  addUser() {

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
    });
  }
}
