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
import { UsersComponent } from './pages/users/users.component';
import { UserComponent } from './pages/users/user/user.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { UseAssetComponent } from './pages/more/use-asset/use-asset.component';
import { AdminComponent } from './pages/admin/admin.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { ToolsComponent } from './pages/tools/tools.component';
import { GroupComponent } from './pages/group/group.component';
import { EditGroupComponent } from './pages/edit-group/edit-group.component';

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
      {
        path: 'useAsset',
        component: UseAssetComponent,
      },
    ],
  },
  {
    path: 'editGroup',
    component: EditGroupComponent,
  },
  {
    path: 'group',
    component: GroupComponent,
  },
  {
    path: 'schedule',
    component: ScheduleComponent,
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
    // component: ProfileComponent,
    component: EditProfileComponent,
    canActivate: [AuthGuardService],
    // https://stackblitz.com/angular/vromeokjvrx?file=src%2Fapp%2Fapp-routing.module.ts
  },
  {
    path: 'edit',
    component: EditProfileComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuardService],
    // https://stackblitz.com/angular/vromeokjvrx?file=src%2Fapp%2Fapp-routing.module.ts
  },
  {
    path: 'tools',
    component: ToolsComponent,
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
