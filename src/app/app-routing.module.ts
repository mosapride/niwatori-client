import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './pages/more/about/about.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/login/profile/profile.component';
import { TermsComponent } from './pages/more/terms/terms.component';
import { PrivacyComponent } from './pages/more/privacy/privacy.component';
import { AuthGuardService } from './service/auth-guard.service';
import { UserInfoService } from './service/user-info.service';
import { UsersComponent } from './pages/c/users/users.component';
import { UserComponent } from './pages/c/users/user/user.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'more',
    children: [
      {
        path: 'about',
        component: AboutComponent,
      },
      {
        path: 'terms',
        component: TermsComponent,
      },
      {
        path: 'privacy',
        component: PrivacyComponent,
      },
    ],
  },
  {
    path: 'u',
    children: [
      {
        path: '',
        component: UsersComponent,
      },
      {
        path: ':youtubeChannelId',
        component: UserComponent,
      },
    ],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuardService],
    // https://stackblitz.com/angular/vromeokjvrx?file=src%2Fapp%2Fapp-routing.module.ts
  },

  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
  providers: [AuthGuardService, UserInfoService],
})
export class AppRoutingModule {}
