import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppService } from './service/app.service';
import { RequestClientService } from './service/request-client.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  navbarActive = false;
  googleLoginUrl = '';
  constructor(private readonly appService: AppService, private readonly req: RequestClientService) {
    this.googleLoginUrl = `${environment.apiUrl}google/login`;
  }
  ngOnInit(): void {
    this.req.login().subscribe(data => {
      console.log(data);
    });
  }

  cookieCheck(): void {
    this.appService.cookieCheck();
  }
}
