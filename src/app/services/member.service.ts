import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { SearchMeta } from '../models/search-meta';
import { catchError, debounceTime, distinctUntilChanged, map, merge, switchMap, tap } from 'rxjs/operators';


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

  autoSearchMembersByEmailWildcard(type: string, text$: Observable<string>, searchObj: SearchMeta): Observable<object | {} | any[]> {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => searchObj.searching = true),
      switchMap(term => term.length < 3 ? of([]) :
        this.searchMembersByEmailWildCard(term: string): Observable<object> {
          (type, term).pipe(
          tap(() => searchObj.searchFailed = false),
          catchError(() => {
            searchObj.searchFailed = true;
            return of([]);
          }), )),
      tap(() => searchObj.searching = false),
      merge(new Observable(() => () => searchObj.searching = false)), );
  }

  searchMembersByEmailWildCard(term: string): Observable<object> {
    return this.http
      .get<Array<{email: string}>>(environment.apiRoot + '/tennis/members/search/'+term).pipe(
      map(response => response['data'] ? response['data'].map( (val: any) => ({email: val.email})) : undefined));
  }

  findMemberByEmail(email: any): Observable<any> {
    return this.http.get(environment.apiRoot + '/tennis/members', email);
  }

  getResidentId(): Observable<any> {
    return this.http.get(environment.apiRoot + '/tennis/members/resident', {});
  }

  isLoggedIn(): boolean {
    const memberls: any = sessionStorage.getItem('memberInfo');
    const isLoggedIn = !!memberls;
    this.loggedIn.next(isLoggedIn);
    return isLoggedIn;
  }

  logout(): void {
    sessionStorage.removeItem('memberInfo');
    sessionStorage.removeItem('allReservations');
    this.loggedIn.next(false);
  }
}
