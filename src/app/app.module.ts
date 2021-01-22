import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/more/about/about.component';
import { ProfileComponent } from './pages/login/profile/profile.component';
import { LoginComponent } from './pages/login/login.component';
import { TermsComponent } from './pages/more/terms/terms.component';
import { PrivacyComponent } from './pages/more/privacy/privacy.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthGuardService } from './service/auth-guard.service';
import { UsersComponent } from './pages/users/users.component';
import { UserComponent } from './pages/users/user/user.component';
import { UserLinkComponent } from './pages/users/user/user-link/user-link.component';
import { SearchComponent } from './pages/users/search/search.component';
import { SelectGenreComponent } from './pages/util/select-genre/select-genre.component';
import { ShowGenreComponent } from './pages/util/show-genre/show-genre.component';
import { LightboxImgGridComponent } from './pages/util/lightbox-img-grid/lightbox-img-grid.component';
import { ConfirmDialogComponent } from './pages/util/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    ProfileComponent,
    LoginComponent,
    TermsComponent,
    PrivacyComponent,
    UsersComponent,
    UserComponent,
    UserLinkComponent,
    SearchComponent,
    SelectGenreComponent,
    ShowGenreComponent,
    LightboxImgGridComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  providers: [AuthGuardService],
  bootstrap: [AppComponent],
})
export class AppModule {}
