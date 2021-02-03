import { Component, OnInit } from '@angular/core';
import { Schedule } from 'src/app/dto/video.dto';
import { RequestClientService } from 'src/app/service/request-client.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  schedules: Schedule[] = [];
  constructor(private readonly requestClientService: RequestClientService) {}

  ngOnInit(): void {
    this.requestClientService.getSchedules().subscribe((data) => (this.schedules = data));
  }
}
