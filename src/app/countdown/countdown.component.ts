import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import 'moment-timezone';

declare var $ : any;

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css']
})
export class CountdownComponent implements OnInit {
  @Output() done = new EventEmitter();
  public days: string;
  public hours: string;
  public minutes: string;
  public seconds: string;
  private readonly date: Date;
  private passed: boolean;

  constructor() {
    this.passed = false;
    this.date = moment.tz('2019-12-13 00:00', 'america/new_york').toDate();
    //this.date = moment.tz('2019-05-01 08:25', 'sweden/stockholm').toDate();
  }

  ngOnInit() {
    (<any>$('#countdown')).countdown(this.date, (event) => {
      this.days = event.offset.totalDays.toString();
      this.hours = event.offset.hours.toString();
      this.minutes = event.offset.minutes.toString();
      this.seconds = event.offset.seconds.toString();
      if (this.days.length === 1) {
        this.days = '0' + this.days;
      }
      if (this.hours.length !== 2) {
        this.hours = '0' + this.hours;
      }
      if (this.minutes.length !== 2) {
        this.minutes = '0' + this.minutes;
      }
      if (this.seconds.length !== 2) {
        this.seconds = '0' + this.seconds;
      }
      // if (event.elapsed) {
      if (!this.passed) {
        this.passed = true;
        this.done.emit();
      }
      // }
    });
  }
}
