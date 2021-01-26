import { Component, OnInit } from '@angular/core';
import { ReservationsService } from '../services/reservations.service';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.sass']
})
export class ReservationsComponent implements OnInit {

  reservations: Array<any> = [];

  constructor(private reservationsService: ReservationsService) {
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

}
