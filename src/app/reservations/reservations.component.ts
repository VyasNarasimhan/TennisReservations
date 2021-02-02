import { Component, OnInit } from '@angular/core';
import { ReservationsService } from '../services/reservations.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.sass']
})
export class ReservationsComponent implements OnInit {

  memberInfo: any;

  reservations: Array<any> = [];
  reservationsDisplay1: any;
  reservationsDisplay2: any;
  reservationsDisplay3: any;
  reservationsDisplay4: any;

  nextDay = 3600 * 1000 * 24;
  // tslint:disable-next-line: max-line-length
  datesForNextWeek = [new Date(), new Date(Date.now() + this.nextDay), new Date(Date.now() + 2 * this.nextDay), new Date(Date.now() + 3 * this.nextDay), new Date(Date.now() + 4 * this.nextDay), new Date(Date.now() + 5 * this.nextDay), new Date(Date.now() + 6 * this.nextDay)];
  currentDate = this.datesForNextWeek[0];
  displayDatesForNextWeek: string[] = [];
  selectedIndex = 0;
  reservationsLeft = 0;

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
      const memberls: any = localStorage.getItem('memberInfo');
      this.memberInfo = JSON.parse(memberls);
      this.generateReservationTable(this.currentDate);
    }
    for (const date of this.datesForNextWeek) {
      this.displayDatesForNextWeek.push(date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear());
    }
  }
  // tslint:disable-next-line: typedef
  addReservation(index: number, court: number) {
    // tslint:disable-next-line: max-line-length
    this.reservationsService.save({member: localStorage.getItem('memberInfo'), timeslot: this.times[index], date: new Date(this.currentDate).toISOString().slice(0, 10), courtnumber: court}).subscribe((resp) => {
      localStorage.setItem('allReservations', JSON.stringify(resp.newReservations));
      this.generateReservationTable(this.currentDate);
      console.log('Reservations saved');
    }, (err) => {
      console.log('Save Failed');
    });
  }

  // tslint:disable-next-line: typedef
  unreserve(index: number, court: number) {
    // tslint:disable-next-line: max-line-length
    this.reservationsService.cancel({member: localStorage.getItem('memberInfo'), timeslot: this.times[index], date: new Date(this.currentDate).toISOString().slice(0, 10), courtnumber: court}).subscribe((resp) => {
      localStorage.setItem('allReservations', JSON.stringify(resp.newReservations));
      this.generateReservationTable(this.currentDate);
      console.log('Reservation canceled');
    }, (err) => {
      console.log('Cancel Failed');
      console.log(err);
    });
  }
  // tslint:disable-next-line: typedef
  generateReservationTable(date: Date) {

    this.reservationsDisplay1 = {};
    this.reservationsDisplay2 = {};
    this.reservationsDisplay3 = {};
    this.reservationsDisplay4 = {};
    this.currentDate = date;
    this.selectedIndex = this.datesForNextWeek.indexOf(date);
    let tempReservationLeft = 3;
    console.log(this.selectedIndex);
      // tslint:disable-next-line: typedef
    const allReservations: any = localStorage.getItem('allReservations');
    if (allReservations) {
        // filter out all reservations for current date
        // tslint:disable-next-line: typedef
        const allresobj = JSON.parse(allReservations);

        const filteredReservations = allresobj
        .filter((resn: { reservation_date: string; }) => {
          return moment(new Date(resn.reservation_date), 'YYYYMMDD').isSame(moment(date, 'YYYYMMDD'), 'day');
        });

        // for each time slot add a time slot entry
        // if there is a value in the filtered resn obj for that timeslot and court
        // add an updated timeslot entry obj to that corresponding reservations display array
        let resnForTimeSlot;
        this.times.forEach((timeslot) => {
            resnForTimeSlot = filteredReservations.filter((res: { timeslot: string; }) => {
             return res.timeslot === timeslot;
           });

           // if no entries for this time slot in any of the courts ?

            resnForTimeSlot.forEach((res: { timeslot: string | number; user_fk: any; displayname: any; court: number; }) => {
            const timeslotEntry = {timeslot: res.timeslot,
               memberid : res.user_fk,
                membername : res.displayname,
                 courtnumber : res.court,
                  editable : false};
            if (this.memberInfo.rolename === 'COACH') {
              tempReservationLeft = 1000;
            } else if (res.user_fk === this.memberInfo.id) {
              tempReservationLeft -= 1;
            }
            // add it to the appropriate court num array
            if (res.court === 1){
              this.reservationsDisplay1[res.timeslot] = timeslotEntry;
            }
            if (res.court === 2){
              this.reservationsDisplay2[res.timeslot] = timeslotEntry;
            }
            if (res.court === 3){
              this.reservationsDisplay3[res.timeslot] = timeslotEntry;
            }
            if (res.court === 4){
              this.reservationsDisplay4[res.timeslot] = timeslotEntry;
            }
           });
        });
      }
    this.reservationsLeft = tempReservationLeft;
  }
}
