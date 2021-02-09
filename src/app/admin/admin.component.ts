import { Component, OnInit } from '@angular/core';
import { MemberService } from '../services/member.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  allUsers: any = [];
  data: any = {};
  constructor(private memberService: MemberService) { }
  loggedIn = false;
  ngOnInit(): void {
  }

  // tslint:disable-next-line: typedef
  confirmAdmin() {
    this.memberService.checkAdminIsValid(this.data).subscribe((resp) => {
      console.log('Admin is valid!');
      this.allUsers = resp.allUsers;
      this.loggedIn = true;
    }, (err) => {
      console.log(err);
    });
  }
}
