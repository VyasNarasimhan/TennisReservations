import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { SearchMeta } from '../models/search-meta';


@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private loggedIn = new Subject<boolean>();

  loggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) { }

  checkUserIsValid(data: any): Observable<any> {
    return this.http.post(environment.apiRoot + '/tennis/members', data);
  }
  createUser(data: any): Observable<any> {
    return this.http.put(environment.apiRoot + '/tennis/members', data);
  }
  updatePassword(data: any): Observable<any> {
    return this.http.post(environment.apiRoot + '/tennis/members/change', data);
  }
  resetPassword(data: any): Observable<any> {
    return this.http.post(environment.apiRoot + '/tennis/members/forgot', data);
  }

  searchMembersByEmailWildCard (email: any, searchObj: SearchMeta): Observable<any> {
    // TODO do a member wild card search by email
    return this.http.get(environment.apiRoot + '/tennis/members/search', email);
  }

  findMemberByEmail (email: any) : Observable<any> {
    return this.http.get(environment.apiRoot + '/tennis/member', email);
  }

  isLoggedIn(): boolean {
    const memberls: any = localStorage.getItem('memberInfo');
    const isLoggedIn = !!memberls;
    this.loggedIn.next(isLoggedIn);
    return isLoggedIn;
  }

  logout(): void {
    localStorage.removeItem('memberInfo');
    localStorage.removeItem('allReservations');
    this.loggedIn.next(false);
  }
}
