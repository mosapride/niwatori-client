import { Component, OnInit } from '@angular/core';
import { UserRole } from './dto/user.dto';
import { RequestClientService } from './service/request-client.service';
import { UserInfoService } from './service/user-info.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  admin = UserRole.ADMIN;
  role: UserRole | undefined;
  navbarActive = false;
  constructor(public readonly userInfoService: UserInfoService, private readonly requestClientService: RequestClientService) {}
  ngOnInit(): void {
    this.requestClientService.profile().subscribe(
      (user) => {
        this.role = user.role;
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
