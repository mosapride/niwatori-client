import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ResponseUserInfo, ResponseYoutubeInfo, User } from '../dto/user.dto';
import { UserInfoService } from './user-info.service';

const headerJsonOption = (): { headers: HttpHeaders; responseType: 'json'; withCredentials: true; observe: 'body' } => {
  const headers = new HttpHeaders();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  return {
    headers,
    responseType: 'json',
    withCredentials: true,
    observe: 'body',
  };
};

const headerOptionLogout = (): {
  headers: HttpHeaders;
  responseType: 'text';
  withCredentials: true;
  observe: 'body';
} => {
  const headers = new HttpHeaders();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  headers.append('Access-Control-Allow-Origin', '*');
  return {
    headers,
    responseType: 'text',
    withCredentials: true,
    observe: 'body',
  };
};

@Injectable({
  providedIn: 'root',
})
export class RequestClientService {
  constructor(private readonly httpClient: HttpClient, private readonly userInfoService: UserInfoService) {}

  public profile(): Observable<User> {
    return this.httpClient.get<User>(`${environment.apiUrl}user/profile`, headerJsonOption()).pipe(
      tap((user) => {
        this.userInfoService.setUserInfo(user.youtubeChannelName);
      })
    );
  }

  public getYoutubeDataChannelInfo(channel: string): Observable<ResponseYoutubeInfo> {
    return this.httpClient.get<ResponseYoutubeInfo>(`${environment.apiUrl}google/channel/${channel}`, headerJsonOption());
  }

  public logout(): void {
    this.httpClient.post(`${environment.apiUrl}google/logout`, '', headerOptionLogout()).subscribe(() => {
      window.location.assign(environment.host);
    });
  }
}
