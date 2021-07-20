import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MemberService } from '../services/member.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  data: any = {};
  successMessage = '';
  errorMessage = '';
  constructor(public ngbActiveModal: NgbActiveModal, private memberService: MemberService) { }

  ngOnInit(): void {
  }

  // tslint:disable-next-line: typedef
  sendFeedback() {
    let memberInfo: any = sessionStorage.getItem('memberInfo');
    memberInfo = JSON.parse(memberInfo);
    this.data.email = memberInfo.email;
    this.data.name = memberInfo.displayname;
    this.memberService.sendFeedback(this.data).subscribe((resp) => {
      console.log('Feedback sent');
      this.successMessage = resp.success;
    }, (err) => {
      console.log('Error');
      this.errorMessage = err.error;
    });
  }
}
