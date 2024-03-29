import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Genre, RequestGenres, ResponseFindGenre } from '../dto/genre.dto';
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
import { RequestUserLinks, ResponseUserLinks } from '../dto/user.link.dto';
import { RequestUserTimeSchedules, ResponseUserTimeSchedules } from '../dto/user.time.schedule.dto';
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

const headerPostJsonOption = (): { withCredentials: true } => {
  return {
    withCredentials: true,
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
    requestProfile.name = this._sliceProfileDataString(requestProfile.name);
    requestProfile.nameKatakana = this._sliceProfileDataString(requestProfile.nameKatakana);
    requestProfile.nickname = this._sliceProfileDataString(requestProfile.nickname);
    requestProfile.stature = this._sliceProfileDataString(requestProfile.stature);
    requestProfile.birthday = this._sliceProfileDataString(requestProfile.birthday);
    requestProfile.sex = this._sliceProfileDataString(requestProfile.sex);
    requestProfile.contents = this._sliceProfileDataText(requestProfile.contents);
    requestProfile.liveTimeMessage = this._sliceProfileDataText(requestProfile.liveTimeMessage);
    requestProfile.freeSpace = this._sliceProfileDataText(requestProfile.freeSpace);
    return this.httpClient.patch(`${environment.apiUrl}user/profile`, requestProfile, headerPatchJsonOption());
  }

  _sliceProfileDataString(str?: string): string {
    if (!str) {
      return '';
    }
    return str.slice(0, 200);
  }

  _sliceProfileDataText(str?: string): string {
    if (!str) {
      return '';
    }
    return str.slice(0, 300);
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
    return this.httpClient.get<void>(`${environment.apiUrl}google/update`, headerGetJsonOption());
  }

  /**
   * ジャンル一覧を取得する
   */
  public genre(): Observable<ResponseFindGenre[]> {
    return this.httpClient.get<ResponseFindGenre[]>(`${environment.apiUrl}genre`, headerGetJsonOption());
  }

  /**
   * ジャンル一覧を取得する(管理用)
   */
  public genreOriginal(): Observable<Genre[]> {
    return this.httpClient.get<Genre[]>(`${environment.apiUrl}genre/original`, headerGetJsonOption());
  }

  public deleteGenre(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiUrl}genre/${id}`, headerDeleteFileOption());
  }

  public postGenre(data: RequestGenres): Observable<Genre[]> {
    return this.httpClient.post<Genre[]>(`${environment.apiUrl}genre/all`, data, headerPostJsonOption());
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
    const patchRole: PatchRole = { role };
    return this.httpClient.patch(`${environment.apiUrl}user/role`, patchRole, headerPatchJsonOption());
  }

  /**
   * 強制的にユーザーの追加を行う
   * @param youtubeChannelId チャンネルid
   */
  public addUser(youtubeChannelId: string): Observable<void> {
    return this.httpClient.post<void>(`${environment.apiUrl}google/user`, { youtubeChannelId }, headerPostJsonOption());
  }

  /**
   * 強制的にユーザーの削除を行う
   * @param youtubeChannelId チャンネルid
   */
  public delUser(youtubeChannelId: string): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiUrl}google/user/${youtubeChannelId}`, headerDeleteFileOption());
  }

  /**
   * @param data ユーザーのリンク情報
   * @returns ResponseUserLinks
   */
  public postLinks(data: RequestUserLinks): Observable<ResponseUserLinks> {
    return this.httpClient.post<ResponseUserLinks>(`${environment.apiUrl}user/link`, data, headerPostJsonOption());
  }

  /**
   * ユーザーのリンク情報を取得する
   * @param youtubeChannelId チャンネルID
   * @returns ResponseUserLinksの配列(ソート済み)
   */
  public getLinks(youtubeChannelId: string): Observable<ResponseUserLinks> {
    return this.httpClient.get<ResponseUserLinks>(`${environment.apiUrl}user/link/${youtubeChannelId}`, headerGetJsonOption());
  }

  /**
   * @param data ユーザーの配信時間情報
   * @returns ResponseUserTimeSchedules
   */
  public postTimeSchedule(data: RequestUserTimeSchedules): Observable<ResponseUserTimeSchedules> {
    return this.httpClient.post<ResponseUserTimeSchedules>(`${environment.apiUrl}user/time-schedule`, data, headerPostJsonOption());
  }

  /**
   * ユーザーの配信時間情報を取得する
   * @param youtubeChannelId チャンネルID
   * @returns ResponseUserTimeSchedules
   */
  public getTimeSchedule(youtubeChannelId: string): Observable<ResponseUserTimeSchedules> {
    return this.httpClient.get<ResponseUserTimeSchedules>(
      `${environment.apiUrl}user/time-schedule/${youtubeChannelId}`,
      headerGetJsonOption()
    );
  }
}
