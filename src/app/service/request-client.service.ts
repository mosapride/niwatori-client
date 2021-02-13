import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ResponseFindGenre } from '../dto/genre.dto';
import {
  PatchRole,
  RequestProfile,
  RequestProfileUsers,
  RequestUser,
  RequestUserList,
  ResponseYoutubeInfo,
  User,
  UserRole,
} from '../dto/user.dto';
import { HasGenreIds } from '../dto/user.genre.dto';
import { Schedule, Video } from '../dto/video.dto';
import { UserInfoService } from './user-info.service';

/**
 * `Patch`メソッド用header option.
 *
 * bodyに情報を設定して更新を行うためのOption。成功時はtextデータ(ok)を取得する。
 */
const headerPatchJsonOption = (): { responseType: 'text'; withCredentials: true; observe: 'body' } => {
  return {
    responseType: 'text',
    withCredentials: true,
    observe: 'body',
  };
};

const headerUploadFileOption = (): { withCredentials: true } => {
  return {
    withCredentials: true,
  };
};

const headerDeleteFileOption = (): { withCredentials: true } => {
  return {
    withCredentials: true,
  };
};

/**
 * `GET`メソッド用header option.
 *
 * URL情報よりJSONデータを取得する。
 */
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

/**
 * Googleログアウト用header option.
 */
const headerOptionGoogleLogout = (): {
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

  /**
   * プロフィース情報を取得する
   */
  public profile(): Observable<User> {
    return this.httpClient.get<User>(`${environment.apiUrl}user/profile`, headerGetJsonOption()).pipe(
      tap((user) => {
        this.userInfoService.setUserInfo(user.youtubeChannelName);
      })
    );
  }

  /**
   * Youtube DATA APIを利用し、youtubeのチャンネル情報を取得する。
   * @param channel youtubeChannelId
   */
  public getYoutubeDataChannelInfo(channel: string): Observable<ResponseYoutubeInfo> {
    return this.httpClient.get<ResponseYoutubeInfo>(`${environment.apiUrl}google/channel/${channel}`, headerGetJsonOption());
  }

  /**
   * プロフィールをすべて更新(上書)きする。
   *
   * @param requestProfile プロフィール情報
   */
  public patchProfile(requestProfile: RequestProfile): Observable<string> {
    return this.httpClient.patch(`${environment.apiUrl}user/profile`, requestProfile, headerPatchJsonOption());
  }

  /**
   * Youtube DATA API からログアウト、Auth Cookie情報を削除しトップページに遷移する。
   */
  public logout(): void {
    this.userInfoService.logout();
    this.httpClient.post(`${environment.apiUrl}google/logout`, '', headerOptionGoogleLogout()).subscribe(() => {
      window.location.assign(environment.host);
    });
  }

  /**
   * 退会の実行
   */
  public withDrawal(): void {
    this.userInfoService.logout();
    this.httpClient.delete(`${environment.apiUrl}google`, headerOptionGoogleLogout()).subscribe(() => {
      window.location.assign(environment.host);
    });
  }

  public updateVideos(): Observable<void> {
    return this.httpClient.get<void>(`${environment.apiUrl}google/update-video`, headerGetJsonOption());
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

  public getHasGenreByYoutubeChannelId(youtubeChannelId: string): Observable<HasGenreIds> {
    return this.httpClient.get<HasGenreIds>(`${environment.apiUrl}user/genre/${youtubeChannelId}`, headerGetJsonOption());
  }

  /**
   * ジャンルIDを設定する(新規上書き)
   * @param hasGenreIds ジャンルID LIST
   */
  public patchHasGenre(hasGenreIds: HasGenreIds): Observable<string> {
    return this.httpClient.patch(`${environment.apiUrl}user/genre`, hasGenreIds, headerPatchJsonOption());
  }

  /**
   * 配信者一覧を取得する
   */
  public getUsers(): Observable<RequestUserList[]> {
    return this.httpClient.get<RequestUserList[]>(`${environment.apiUrl}user/u`, headerGetJsonOption());
  }

  /**
   * 配信者詳細ページ情報を取得する。
   */
  public getUser(youtubeChannelId: string): Observable<RequestUser> {
    return this.httpClient.get<RequestUser>(`${environment.apiUrl}user/u/${youtubeChannelId}`, headerGetJsonOption());
  }

  /**
   * 配信者詳細ページのVideo情報を取得する
   */
  public getVideosByUser(youtubeChannelId: string): Observable<Video[]> {
    return this.httpClient.get<Video[]>(`${environment.apiUrl}video/${youtubeChannelId}`, headerGetJsonOption());
  }

  /**
   * 配信者詳細ページ - 配信者詳細ページのためのリンクデータ
   * @param page ページ番号
   */
  public getProfileSelectUsers(page = 0): Observable<RequestProfileUsers> {
    return this.httpClient.get<RequestProfileUsers>(`${environment.apiUrl}user/page/${page}`, headerGetJsonOption());
  }

  /**
   * ユーザーの絞り込みリクエスト(ジャンル)
   *
   * コラボ希望ジャンルと一致するyoutubeChannelIdを返す.
   *
   * @param ids ジャンルIDの配列
   * @return 該当するyoutubeChannelIdの配列
   */
  public matchGenre(ids: number[]): Observable<string[]> {
    return this.httpClient.get<string[]>(`${environment.apiUrl}user/match-genre/${ids.join()}`, headerGetJsonOption());
  }

  /**
   * プロフィール画像ファイルのアップロードを行う
   * @param files プロフィール画像ファイル
   */
  public uploadProfileFile(files: File[]): Observable<void> {
    const formData = new FormData();
    for (const f of files) {
      formData.append('file', f);
    }
    return this.httpClient.post<void>(`${environment.apiUrl}user/upload`, formData, headerUploadFileOption());
  }

  /**
   * プロフィール画像名を取得する
   * @param youtubeChannelId youtubeChannelId
   */
  public getProfileFile(youtubeChannelId: string): Observable<string[]> {
    return this.httpClient.get<string[]>(`${environment.apiUrl}user/image/${youtubeChannelId}`, headerGetJsonOption());
  }

  public deleteProfileFile(imageFileName: string): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiUrl}user/image/${imageFileName}`, headerDeleteFileOption());
  }

  public getSchedules(): Observable<Schedule[]> {
    return this.httpClient.get<Schedule[]>(`${environment.apiUrl}video/schedule`, headerGetJsonOption());
  }

  public updateRole(role: UserRole): Observable<string> {
    console.log(role);
    const patchRole: PatchRole = { role };
    return this.httpClient.patch(`${environment.apiUrl}user/role`, patchRole, headerPatchJsonOption());
  }
}
