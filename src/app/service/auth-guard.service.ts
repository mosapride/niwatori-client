import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { RequestClientService } from './request-client.service';
import { UserInfoService } from './user-info.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly userInfoService: UserInfoService,
    private readonly requestClientService: RequestClientService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.activeCheck();
  }

  async activeCheck(): Promise<boolean> {
    if (this.userInfoService.isAuth()) {
      return true;
    }

    let user;
    try {
      user = await this.requestClientService.profile().toPromise();
    } catch (e: any) {
      this.router.navigate(['/login']);
      return false;
    }
    if (user) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
