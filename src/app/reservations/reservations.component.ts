import { Component, OnInit } from '@angular/core';
import { ReservationsService } from '../services/reservations.service';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.sass']
})
export class ReservationsComponent implements OnInit {

  data: any = {};

  constructor(private reservationsService: ReservationsService) {
    let counter = 0;
    for (let i = 0; i < 2; i++) {
      this.times[counter] = '12:00';
      counter++;
      this.times[counter] = '12:30';
      counter++;
      for (let hour = 1; hour < 12; hour++) {
        this.times[counter] = hour + ':00';
        this.times[counter + 1] = hour + ':30';
        counter += 2;
      }
    }
  }
  times: Array<string> = new Array<string>(48);

  ngOnInit(): void {
  }
  // tslint:disable-next-line: typedef
  saveName() {
    this.reservationsService.save(this.data).subscribe((resp) => {
      console.log('Name saved');
    }, (err) => {
      console.log('Save Failed');
    });
  }

}
