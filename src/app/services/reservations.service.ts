import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {

  constructor(private http: HttpClient) { }

  save(data: any): Observable<any> {
    return this.http.put(environment.apiRoot + '/tennis/reservations', data);
  }
  cancel(data: any): Observable<any> {
    return this.http.post(environment.apiRoot + '/tennis/reservations', data);
  }
  getMaintenanceStatus(): Observable<any> {
    return this.http.get(environment.apiRoot + '/tennis/reservations');
  }
  changeMaintenanceInfo(data: any): Observable<any> {
    return this.http.post(environment.apiRoot + '/tennis/reservations/modifyMaintenance', data);
  }
}
