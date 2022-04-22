import { Component, OnInit } from '@angular/core';
import { UserRole } from './dto/user.dto';
import { RequestClientService } from './service/request-client.service';
import { SeoService } from './service/seo.service';
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
  youtubeChannelId = '';
  constructor(
    public readonly userInfoService: UserInfoService,
    private readonly requestClientService: RequestClientService,
    private readonly seoService: SeoService
  ) {}
  ngOnInit(): void {
    this.seoService.setDefault();

    this.requestClientService.profile().subscribe(
      (user) => {
        this.role = user.role;
        this.youtubeChannelId = user.youtubeChannelId;
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
