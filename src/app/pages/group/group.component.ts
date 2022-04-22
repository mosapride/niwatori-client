import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Schedule } from 'src/app/dto/video.dto';
import { RequestClientService } from 'src/app/service/request-client.service';
import { SeoService } from 'src/app/service/seo.service';

type ViewSchedules = { groupDate: Date; schedule: Schedule[] };
@Component({
  selector: 'app-schedule',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements OnInit {
  schedules: Schedule[] = [];
  viewSchedules: ViewSchedules[] = [];
  constructor(
    private readonly requestClientService: RequestClientService,
    private readonly seoService: SeoService
  ) {}

  ngOnInit(): void {

    this.requestClientService.getSchedules().subscribe((data) => {
      this.seoService.setDefault('グループ - 箱庭');
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
