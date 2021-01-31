import { Component, OnInit } from '@angular/core';
import { ReservationsService } from '../services/reservations.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.sass']
})
export class ReservationsComponent implements OnInit {

  reservations: Array<any> = [];
  reservationsDisplay: any[][] = [];

  constructor(private router: Router, private reservationsService: ReservationsService) {
    let counter = 0;
    let suffix = 'AM';
    for (let i = 0; i < 2; i++) {
      this.times[counter] = '12:00 ' + suffix;
      counter++;
      this.times[counter] = '12:30 ' + suffix;
      counter++;
      for (let hour = 1; hour < 12; hour++) {
        this.times[counter] = hour + ':00 ' + suffix;
        this.times[counter + 1] = hour + ':30 ' + suffix;
        counter += 2;
      }
      suffix = 'PM';
    }
  }
  times: Array<string> = new Array<string>(48);

  ngOnInit(): void {
    if (localStorage.getItem('memberInfo') == null) {
      this.router.navigate(['login']);
    } else {
      this.generateReservationTable(new Date());
    }
  }
  // tslint:disable-next-line: typedef
  makeReservations() {
    this.reservationsService.save(this.reservations).subscribe((resp) => {
      console.log('Name saved');
    }, (err) => {
      console.log('Save Failed');
    });
  }
  // tslint:disable-next-line: typedef
  addReservation(timeSlot: string, date: Date, court: number) {
    this.reservations.push({timeSlot, date, court});
  }
  // tslint:disable-next-line: typedef
  generateReservationTable(date: Date) {
      // tslint:disable-next-line: typedef
      const allReservations: any = localStorage.getItem('allReservations');
      if (allReservations) {
        // filter out all reservations for current date
        // tslint:disable-next-line: typedef
        const filteredReservations = JSON.parse(allReservations).filter((resn: { reservation_date: Date; }) => {
          console.log(resn.reservation_date);
          console.log(date.toISOString().slice(0, 10));
          return resn.reservation_date.valueOf() === date.valueOf();
        });

        // go thru the filtered reservations and build the reservation display table
        // tslint:disable-next-line: max-line-length
        filteredReservations.forEach((reservation: { timeslot: string; user_fk: any; displayName: any; court: number; }) => {
          // tslint:disable-next-line: max-line-length
          const timeslotEntry = {timeslot: reservation.timeslot, memberid : reservation.user_fk, membername : reservation.displayName, courtnumber : reservation.court, editable : false};
          this.reservationsDisplay[this.times.indexOf(reservation.timeslot)][reservation.court] = timeslotEntry;
        });
      }
  }
}
