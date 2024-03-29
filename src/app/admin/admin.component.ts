import { Component, OnInit } from '@angular/core';
import { MemberService } from '../services/member.service';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { ReservationsService } from '../services/reservations.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  isLoaded = false;
  memberFromDb: any;
  userMaint = true;
  courtMaint = false;
  residentMaint = false;
  loadError = '';
  data: any = {};
  email = new FormControl('', [Validators.required, Validators.email]);
  createEmail = new FormControl('', [Validators.required, Validators.email]);
  searchResidentEmail = new FormControl('', [Validators.required, Validators.email]);
  maintenanceForCourts: any;
  maintenanceError = '';
  wellesleyAccountError = '';
  newData: any = {};
  searchResident: any = {};
  residentFromDb: any;
  successMessageMaintenance = '';
  successAddResident = '';
  successDeleteReservations = '';

  constructor(private memberService: MemberService, private router: Router, private reservationsService: ReservationsService) { }

  ngOnInit(): void {
    this.isLoaded = false;
    if (sessionStorage.getItem('memberInfo') == null) {
      this.router.navigate(['login']);
    }
    this.reservationsService.getMaintenanceStatus().subscribe((resp) => {
      this.maintenanceForCourts = resp.maintenanceStatus;
      this.maintenanceForCourts.sort((a: any, b: any) => {
        return a.court - b.court;
      });
      this.isLoaded = true;
    });
  }

  // tslint:disable-next-line: typedef
  searchForUser() {
    this.loadError = '';
    this.data.enteredEmail = this.data.enteredEmail.toUpperCase();
    this.memberService.findMemberByEmail(this.data).subscribe((resp) => {
      this.memberFromDb = resp.user;
      this.memberFromDb.userRole = resp.role.rolename;
    }, (err) => {
      console.log(err);
      this.loadError = err.error.error;
    });
  }

  // tslint:disable-next-line: typedef
  getEmailErrorMessage(email: any) {
    if (email.hasError('required')) {
      return 'Email is required';
    }
    return email.hasError('email') ? 'Not a valid email' : '';
  }

  // tslint:disable-next-line: typedef
  changeRole() {
    this.loadError = '';
    this.memberService.changeRole(this.memberFromDb).subscribe((resp) => {
      this.memberFromDb.userRole = resp.role;
      console.log(this.memberFromDb.userRole);
    }, (err) => {
      console.log(err);
      this.loadError = err.error.error;
    });
  }

  // tslint:disable-next-line: typedef
  changeMaintenanceInfo(index: number, newStatus: boolean) {
    this.maintenanceError = '';
    this.successMessageMaintenance = '';
    this.maintenanceForCourts[index].inmaintenance = newStatus;
    this.reservationsService.changeMaintenanceInfo({values: this.maintenanceForCourts[index], court: index + 1}).subscribe((resp) => {
      console.log('Maintenance info changed');
    }, (err) => {
      console.log(err);
      this.maintenanceError = err.error.error;
    });
  }

  // tslint:disable-next-line: typedef
  changeMaintenanceMessage(index: number) {
    this.maintenanceError = '';
    this.successMessageMaintenance = '';
    this.reservationsService.changeMaintenanceInfo({values: this.maintenanceForCourts[index], court: index + 1}).subscribe((resp) => {
      console.log('Message changed');
      this.successMessageMaintenance = 'Message changed for Court ' + (index + 1);
    }, (err) => {
      console.log(err);
      this.maintenanceError = err.error.error;
    });
  }

  // tslint:disable-next-line: typedef
  enterNewAccountInfo() {
    this.successAddResident = '';
    this.wellesleyAccountError = '';
    this.memberService.createNewAccount(this.newData).subscribe((resp) => {
      console.log('Account added');
      this.successAddResident = 'New account added';
    }, (err) => {
      console.log(err);
      this.wellesleyAccountError = err.error.error;
    });
  }

  // tslint:disable-next-line: typedef
  changeStatus() {
    this.loadError = '';
    this.memberService.changeActiveStatus(this.memberFromDb).subscribe((resp) => {
      console.log('Active status changed');
      this.memberFromDb.active = resp.active;
    }, (err) => {
      console.log(err);
      this.loadError = err.error.error;
    });
  }

  // tslint:disable-next-line: typedef
  changeResidentStatus() {
    this.wellesleyAccountError = '';
    this.memberService.changeResidentActiveStatus(this.residentFromDb).subscribe((resp) => {
      console.log('Resident status changed');
      this.residentFromDb.active = resp.active;
    }, (err) => {
      console.log(err);
      this.wellesleyAccountError = err.error.error;
    });
  }

  // tslint:disable-next-line: typedef
  searchForResident() {
    this.wellesleyAccountError = '';
    this.memberService.searchForResident(this.searchResident).subscribe((resp) => {
      console.log('Resident found');
      this.residentFromDb = resp.resident;
    }, (err) => {
      console.log(err);
      this.wellesleyAccountError = err.error.error;
    });
  }
  // tslint:disable-next-line: typedef
  deleteOldReservations() {
    this.successDeleteReservations = '';
    this.reservationsService.deleteReservations().subscribe((resp) => {
      console.log('Reservations Deleted');
      this.successDeleteReservations = 'Reservations from 6 months ago successfully deleted';
    }, (err) => {
      console.log(err);
    });
  }
}
