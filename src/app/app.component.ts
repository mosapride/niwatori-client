import { Component, OnInit } from '@angular/core';
import { RequestClientService } from './service/request-client.service';
import { UserInfoService } from './service/user-info.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  navbarActive = false;
  constructor(public readonly userInfoService: UserInfoService, private readonly requestClientService: RequestClientService) {}
  ngOnInit(): void {
    this.requestClientService.profile().subscribe(
      (user) => {
        this.userInfoService.setUserInfo(user.youtubeChannelName);
      },
      (error: any) => {
        console.log('welcome guest user!!');
      }
    );
  }

  logout(): void {
    this.requestClientService.logout();
  }

}
