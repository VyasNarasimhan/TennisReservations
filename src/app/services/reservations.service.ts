import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {

  constructor(private http: HttpClient) { }
  
  save(aName: string): Observable<any> {
    return this.http.put(environment.apiRoot + '/tennis/reservations/', aName);
  }
}
