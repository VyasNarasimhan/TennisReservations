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
  error = '';
  constructor(private memberService: MemberService, private router: Router) { }

  ngOnInit(): void {
    this.memberService.getResidentId().subscribe((resp) => {
      this.data.role = resp.residentId.id;
    });
  }

  // tslint:disable-next-line: typedef
  addUser() {
    this.error = '';
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
      this.error = err;
    });
  }
}
