import { Component, OnInit } from '@angular/core';
import { AppService } from './service/app.service';
import { RequestClientService } from './service/request-client.service';
import { UserInfoService } from './service/user-info.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  navbarActive = false;
  userName = '';
  constructor(
    private readonly appService: AppService,
    private readonly userInfoService: UserInfoService,
    private readonly requestClientService: RequestClientService,
  ) {}
  ngOnInit(): void {
    this.requestClientService.profile().subscribe(() => {
      this.userName = this.userInfoService.getUserInfo().name;
      console.log(this.userName);
    });
  }

  cookieCheck(): void {
    this.appService.cookieCheck();
  }

  logout(): void {
    this.requestClientService.logout();
  }
}
