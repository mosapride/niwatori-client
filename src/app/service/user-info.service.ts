import { Injectable } from '@angular/core';

export type UserInfo = {
  isLogin: boolean;
  youtubeChannelName: string;
};

@Injectable({
  providedIn: 'root',
})
export class UserInfoService {
  userInfo: UserInfo = { isLogin: false, youtubeChannelName: '' };
  constructor() {}

  setUserInfo(youtubeChannelName: string): void {
    console.log('setUserInfo');
    this.userInfo = { isLogin: true, youtubeChannelName };
  }

  getUserInfo(): UserInfo {
    return this.userInfo;
  }

  isAuth(): boolean {
    return this.userInfo.isLogin;
  }
}
