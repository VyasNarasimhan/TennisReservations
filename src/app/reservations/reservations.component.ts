import { Component, OnInit } from '@angular/core';
import { ReservationsService } from '../services/reservations.service';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.sass']
})
export class ReservationsComponent implements OnInit {

  enteredName: string = '';
  
  constructor(private reservationsService: ReservationsService) {
    var counter = 0
    for (var i = 0; i < 2; i++) {
      this.times[counter] = "12:00"
      counter++;
      this.times[counter] = "12:30"
      counter++;
      for (var hour = 1; hour < 12; hour++) {
        this.times[counter] = hour + ":00";
        this.times[counter+1] = hour + ":30";
        counter += 2;
      }
    }
  }
  times : Array<String> = new Array<String>(48);

  ngOnInit(): void {
  }
  saveName() {
    this.reservationsService.save(this.enteredName).subscribe((resp) => {
      console.log('Name saved');
    }, (err) => {
      console.log('Save Failed');
    });
  }

}
