import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private loggedIn = new Subject<boolean>();
  private isAdmin = new Subject<boolean>();
  loggedIn$ = this.loggedIn.asObservable();
  isAdmin$ = this.isAdmin.asObservable();

  constructor(private http: HttpClient) { }

  checkUserIsValid(data: any): Observable<any> {
    return this.http.post(environment.apiRoot + '/tennis/members/login', data);
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

  findMemberByEmail(data: any): Observable<any> {
    return this.http.get(environment.apiRoot + '/tennis/members/user/' + data.enteredEmail);
  }

  changeRole(data: any): Observable<any> {
    return this.http.post(environment.apiRoot + '/tennis/members/changerole', data);
  }

  createNewAccount(data: any): Observable<any> {
    return this.http.post(environment.apiRoot + '/tennis/members/newAccount', data);
  }

  isLoggedIn(): boolean {
    const memberls: any = sessionStorage.getItem('memberInfo');
    const isLoggedIn = !!memberls;
    this.loggedIn.next(isLoggedIn);
    return isLoggedIn;
  }
  checkIsAdmin(): boolean {
    const admin: any = sessionStorage.getItem('memberInfo');
    this.isAdmin.next(admin === 'admin');
    return admin === 'admin';
  }

  changeActiveStatus(data: any): Observable<any> {
    return this.http.post(environment.apiRoot + '/tennis/members/changeActive', data);
  }

  changeResidentActiveStatus(data: any): Observable<any> {
    return this.http.post(environment.apiRoot + '/tennis/members/changeActiveForResidents', data);
  }

  searchForResident(data: any): Observable<any> {
    return this.http.get(environment.apiRoot + '/tennis/members/searchForResident/' + data.email + '/' + data.username);
  }

  sendFeedback(data: any): Observable<any> {
    // tslint:disable-next-line: max-line-length
    return this.http.get(environment.apiRoot + '/tennis/members/sendFeedbackEmail/' + data.name + '/' + data.email + '/' + data.feedback);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(environment.apiRoot + '/tennis/members/getAllUsers/');
  }

  logout(): void {
    sessionStorage.removeItem('memberInfo');
    sessionStorage.removeItem('allReservations');
    this.loggedIn.next(false);
  }
}
