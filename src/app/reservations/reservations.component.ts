import { Component, OnInit } from '@angular/core';
import { ReservationsService } from '../services/reservations.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { MemberService } from '../services/member.service';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements OnInit {

  isLoaded = false;
  memberInfo: any;
  firstMemberInfo: any;

  courtNum = 'court1';

  reservations: Array<any> = [];
  reservationsDisplay1: any;
  reservationsDisplay2: any;
  reservationsDisplay3: any;
  reservationsDisplay4: any;

  nextDay = 3600 * 1000 * 24;
  // tslint:disable-next-line: max-line-length
  datesForNextWeek = [new Date(), new Date(Date.now() + this.nextDay), new Date(Date.now() + 2 * this.nextDay), new Date(Date.now() + 3 * this.nextDay), new Date(Date.now() + 4 * this.nextDay), new Date(Date.now() + 5 * this.nextDay), new Date(Date.now() + 6 * this.nextDay)];
  currentDate = this.datesForNextWeek[0];
  displayDate = moment(new Date(this.currentDate)).format('MM-DD-YYYY');
  displayDatesForNextWeek: string[] = [];
  selectedIndex = 0;
  reservationsLeft = 0;
  error = '';
  maintenanceStatus: any;
  anotherUser = '';
  reserveAsAnotherUserMessage = '';
  reserveAsError = '';

  constructor(private router: Router, private memberService: MemberService, private reservationsService: ReservationsService) { }
  times: Array<string> = ['7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM'];

  ngOnInit(): void {
    this.isLoaded = false;
    if (sessionStorage.getItem('memberInfo') == null) {
      this.router.navigate(['login']);
    } else if (sessionStorage.getItem('memberInfo') === 'admin') {
      this.router.navigate(['admin']);
    } else {
      const memberls: any = sessionStorage.getItem('memberInfo');
      this.memberInfo = JSON.parse(memberls);
      this.firstMemberInfo = JSON.parse(memberls);
      this.reservationsService.getReservations().subscribe((resp) => {
        sessionStorage.setItem('allReservations', JSON.stringify(resp.allReservations));
        this.generateReservationTable(this.currentDate);
        this.isLoaded = true;
      }, (err) => {
        console.log(err);
      });
    }
    if (this.firstMemberInfo.rolename === 'COACH') {
      for (let i = 7; i < 14; i++) {
        this.datesForNextWeek.push(new Date(Date.now() + i * this.nextDay));
      }
    }
    for (const date of this.datesForNextWeek) {
      this.displayDatesForNextWeek.push(date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear());
    }
    const temp: any = sessionStorage.getItem('maintenanceInfo');
    this.maintenanceStatus = JSON.parse(temp);
    this.maintenanceStatus.sort((a: any, b: any) => {
      return a.court - b.court;
    });
  }

  // tslint:disable-next-line: typedef
  searchForUser() {
<<<<<<< HEAD
    this.error = '';
=======
    this.reserveAsError = '';
>>>>>>> dev
    this.reserveAsAnotherUserMessage = '';
    this.anotherUser = this.anotherUser.toUpperCase();
    this.memberService.findMemberByEmail({enteredEmail: this.anotherUser}).subscribe((resp) => {
      this.memberInfo = resp.user;
      this.generateReservationTable(this.currentDate);
      this.reserveAsAnotherUserMessage = 'Success! You can now reserve as ' + this.memberInfo.email;
    }, (err) => {
      console.log(err);
<<<<<<< HEAD
      this.error = err.error.error;
=======
      this.reserveAsError = err.error.error;
>>>>>>> dev
    });
  }

  // tslint:disable-next-line: typedef
  addReservation(index: number, court: number) {
    this.error = '';
    // tslint:disable-next-line: max-line-length
    this.reservationsService.save({member: this.memberInfo, timeslot: this.times[index], date: moment(new Date(this.currentDate)).format('YYYY-MM-DD'), courtnumber: court}).subscribe((resp) => {
      sessionStorage.setItem('allReservations', JSON.stringify(resp.newReservations));
      this.generateReservationTable(this.currentDate);
      console.log('Reservations saved');
    }, (err) => {
      console.log('Save Failed');
      this.error = err.error.error;
    });
  }

  // tslint:disable-next-line: typedef
  compareTimeAndTimeSlot(timeSlot: string) {
    const currentTime = moment(new Date());
    const reqDate = moment(this.currentDate);
    const timeSlotTime = moment(timeSlot, 'hh:mm A');
    reqDate.set({hour: timeSlotTime.hour(), minute: timeSlotTime.minute()});
    if (currentTime > reqDate) {
      return 1;
    } else if (currentTime === reqDate) {
      return 0;
    } else {
      return -1;
    }
  }

  // tslint:disable-next-line: typedef
  unreserve(index: number, court: number) {
    this.error = '';
    // tslint:disable-next-line: max-line-length
    this.reservationsService.cancel({member: this.memberInfo, timeslot: this.times[index], date: moment(new Date(this.currentDate)).format('YYYY-MM-DD'), courtnumber: court}).subscribe((resp) => {
      sessionStorage.setItem('allReservations', JSON.stringify(resp.newReservations));
      this.generateReservationTable(this.currentDate);
      console.log('Reservation canceled');
    }, (err) => {
      console.log('Cancel Failed');
      console.log(err);
      this.error = err.error.error;
    });
  }
  // tslint:disable-next-line: typedef
  generateReservationTable(date: Date) {
    this.error = '';
    this.reservationsDisplay1 = {};
    this.reservationsDisplay2 = {};
    this.reservationsDisplay3 = {};
    this.reservationsDisplay4 = {};
    this.currentDate = date;
    this.displayDate = moment(new Date(this.currentDate)).format('MM-DD-YYYY');
    this.selectedIndex = this.datesForNextWeek.indexOf(date);
    let tempReservationLeft = 3;
      // tslint:disable-next-line: typedef
    const allReservations: any = sessionStorage.getItem('allReservations');
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
            if (this.firstMemberInfo.rolename === 'COACH') {
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
    if (tempReservationLeft < 0) {
      tempReservationLeft = 0;
    }
    this.reservationsLeft = tempReservationLeft;
  }
}
