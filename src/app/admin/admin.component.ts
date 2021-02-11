import { Component, OnInit } from '@angular/core';
import { MemberService } from '../services/member.service';
import {Observable} from 'rxjs';
import { Router } from '@angular/router';
import { SearchMeta } from '../models/search-meta';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import {  HttpErrorResponse } from '@angular/common/http';

let searchMetaRef: SearchMeta;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  memberFromDb: any;
  searchTerm: any; // ng-typeahead search model
  searchMeta = new SearchMeta();
  loadError = '';
  memberService : MemberService;

  constructor(private memService: MemberService, private router: Router) {
    this.memberService = memService;
   }

  ngOnInit(): void {
    if (sessionStorage.getItem('memberInfo') == null) {
      this.router.navigate(['login']);
    }
    this.searchTerm = null;
  }

  searchEmail(text$: Observable<string>): Observable<any> {
    return this.memberService.searchMembersByEmailWildCard(text$, searchMetaRef);
  }

  // tslint:disable-next-line: typedef
  memberSearchFormatter(x: { email: string }) {
    return x.email;
  }

  // tslint:disable-next-line: typedef
  selectedItem(ev: NgbTypeaheadSelectItemEvent) {

    // the next two lines are used to clear the search input after selecting an item
    ev.preventDefault();
    this.searchTerm = null;

    /* istanbul ignore else */
    if (ev.item.email) {

      // TODO fetch the single user by email
      this.memberService.findMemberByEmail(ev.item.email).subscribe (
        (data: any) => {
          this.memberFromDb = data;
        }, (errorData: HttpErrorResponse) => {
            this.loadError = errorData ? errorData.error : 'Unable to find member';
          }
        );
    }
  }
}
