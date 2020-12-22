import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ResponseFindGenre } from '../dto/genre.dto';
import { RequestProfile, ResponseYoutubeInfo, User } from '../dto/user.dto';
import { HasGenreIds } from '../dto/user.genre.dto';
import { UserInfoService } from './user-info.service';

const headerPatchJsonOption = (): { responseType: 'text'; withCredentials: true; observe: 'body' } => {
  return {
    responseType: 'text',
    withCredentials: true,
    observe: 'body',
  };
};

const headerGetJsonOption = (): { headers: HttpHeaders; responseType: 'json'; withCredentials: true; observe: 'body' } => {
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
    return this.httpClient.get<User>(`${environment.apiUrl}user/profile`, headerGetJsonOption()).pipe(
      tap((user) => {
        this.userInfoService.setUserInfo(user.youtubeChannelName);
      })
    );
  }

  public getYoutubeDataChannelInfo(channel: string): Observable<ResponseYoutubeInfo> {
    return this.httpClient.get<ResponseYoutubeInfo>(`${environment.apiUrl}google/channel/${channel}`, headerGetJsonOption());
  }

  public patchProfile(requestProfile: RequestProfile): Observable<string> {
    return this.httpClient.patch(`${environment.apiUrl}user/profile`, requestProfile, headerPatchJsonOption());
  }

  /**
   * Youtube DATA API からログアウト、Auth Cookie情報を削除しトップページに遷移する。
   */
  public logout(): void {
    this.httpClient.post(`${environment.apiUrl}google/logout`, '', headerOptionLogout()).subscribe(() => {
      window.location.assign(environment.host);
    });
  }

  /**
   * ジャンル一覧を取得する
   */
  public genre(): Observable<ResponseFindGenre[]> {
    return this.httpClient.get<ResponseFindGenre[]>(`${environment.apiUrl}genre`, headerGetJsonOption());
  }

  /**
   * 所持しているジャンルIDを取得する
   */
  public getHasGenre(): Observable<HasGenreIds> {
    return this.httpClient.get<HasGenreIds>(`${environment.apiUrl}user/genre`, headerGetJsonOption());
  }

  /**
   * ジャンルIDを設定する(新規上書き)
   * @param hasGenreIds ジャンルID LIST
   */
  public patchHasGenre(hasGenreIds: HasGenreIds): Observable<string> {
    return this.httpClient.patch(`${environment.apiUrl}user/genre`, hasGenreIds, headerPatchJsonOption());
  }
}
