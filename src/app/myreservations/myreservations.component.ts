import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Component({
  selector: 'app-myreservations',
  templateUrl: './myreservations.component.html',
  styleUrls: ['./myreservations.component.scss']
})
export class MyreservationsComponent implements OnInit {

  reservations: Array<any> = [];
  memberInfo: any;

  constructor(public ngbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.memberInfo = sessionStorage.getItem('memberInfo');
    this.memberInfo = JSON.parse(this.memberInfo);
    const allReservationsString: any = sessionStorage.getItem('allReservations');
    const allReservations: any = JSON.parse(allReservationsString);
    for (const reservation of allReservations) {
      // tslint:disable-next-line: max-line-length
      if (reservation.user_fk === this.memberInfo.id && !reservation.canceled) {
        // tslint:disable-next-line: max-line-length
        this.reservations.push({court: reservation.court, timeslot: reservation.timeslot, date: moment(new Date(reservation.reservation_date)), display: moment(new Date(reservation.reservation_date)).format('MM-DD-YYYY')});
      }
    }
    this.reservations.sort((a, b) => a.date - b.date);
  }

}
