import { Component, OnInit } from '@angular/core';
import { Schedule } from 'src/app/dto/video.dto';
import { RequestClientService } from 'src/app/service/request-client.service';

type ViewSchedules = { groupDate: Date; schedule: Schedule[] };
@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  schedules: Schedule[] = [];
  viewSchedules: ViewSchedules[] = [];
  constructor(private readonly requestClientService: RequestClientService) {}

  ngOnInit(): void {
    this.requestClientService.getSchedules().subscribe((data) => {
      this.schedules = data;

      let groupDate: Date | undefined;
      let groupSchedule: Schedule[] = [];
      for (const element of data) {
        if (!groupDate) {
          groupDate = this.getYMD(element.streamAt);
        }
        // if (groupDate === this.getYMD(element.streamAt)) {
        if (this.compareDate(groupDate, this.getYMD(element.streamAt))) {
          groupSchedule.push(element);
        } else {
          if (groupDate !== undefined) {
            this.viewSchedules.push({ groupDate, schedule: groupSchedule });
          }
          groupDate = this.getYMD(element.streamAt);
          groupSchedule = [];
          groupSchedule.push(element);
        }
      }
      if (groupDate !== undefined) {
        this.viewSchedules.push({ groupDate, schedule: groupSchedule });
      }
    });
  }

  private getYMD(date: Date): Date {
    date = new Date(date);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private compareDate(a: Date, b: Date): boolean {
    return a.getTime() === b.getTime();
  }
}
