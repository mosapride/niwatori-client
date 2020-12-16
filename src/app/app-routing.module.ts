import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './pages/more/about/about.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TermsComponent } from './pages/more/terms/terms.component';
import { PrivacyComponent } from './pages/more/privacy/privacy.component';
import { AuthGuardService } from './service/auth-guard.service';
import { UserInfoService } from './service/user-info.service';

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
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuardService]
    // https://stackblitz.com/angular/vromeokjvrx?file=src%2Fapp%2Fapp-routing.module.ts
  },

  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '**',
    redirectTo : ''
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
  providers: [AuthGuardService , UserInfoService]
})
export class AppRoutingModule {}
