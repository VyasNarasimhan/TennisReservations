import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  constructor(private http: HttpClient) { }

  checkUserIsValid(data: any): Observable<any> {
    return this.http.post(environment.apiRoot + '/tennis/members', data);
  }
  createUser(data: any): Observable<any> {
    return this.http.put(environment.apiRoot + '/tennis/members', data);
  }
}
