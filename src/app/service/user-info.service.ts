import { Injectable } from '@angular/core';

export type UserInfo = {
  name: string;
  email: string;
};

@Injectable({
  providedIn: 'root',
})
export class UserInfoService {
  userInfo: UserInfo = { name: '', email: '' };
  constructor() {}

  setUserInfo(name: string, email: string): void {
    this.userInfo = { name, email };
  }

  getUserInfo(): UserInfo {
    return this.userInfo;
  }
}
