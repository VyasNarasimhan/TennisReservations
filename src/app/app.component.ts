import { OnDestroy } from '@angular/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'tennisreservations';
  constructor(private router: Router) { }

  // tslint:disable-next-line: typedef
  ngOnDestroy() {
    sessionStorage.removeItem('memberInfo');
    sessionStorage.removeItem('allReservations');
  }
}
