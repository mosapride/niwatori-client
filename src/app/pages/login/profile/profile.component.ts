import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResponseFindGenre } from 'src/app/dto/genre.dto';
import { RequestProfile } from 'src/app/dto/user.dto';
import { HasGenreIds } from 'src/app/dto/user.genre.dto';
import { RequestClientService } from 'src/app/service/request-client.service';
import { UserInfoService } from 'src/app/service/user-info.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profile: RequestProfile = {};
  responseFindGenres: ResponseFindGenre[] = [];
  constructor(
    private readonly requestClientService: RequestClientService,
    public readonly userInfoService: UserInfoService,
    private matSnackBar: MatSnackBar
  ) {}

  async ngOnInit(): Promise<void> {
    await this.requestClientService.profile().subscribe((data) => {
      this.profile = data;
    });
    await this.requestClientService.genre().subscribe((data) => {
      this.responseFindGenres = data;
      this.checkGenre();
    });
  }

  checkGenre(): void {
    this.requestClientService.getHasGenre().subscribe((data) => {
      this.responseFindGenres.forEach((v) => {
        v.items.forEach((j) => {
          if (data.includes(j.id)) {
            j.has = true;
          } else {
            j.has = false;
          }
        });
      });
    });
  }

  requestYoutubeDataChannelInfo(channel: string): void {
    this.requestClientService.getYoutubeDataChannelInfo(channel).subscribe(
      (data) => {
        this.profile.youtubeChannelName = data.youtubeChannelName;
        this.profile.youtubeThumbnailsUrl = data.youtubeThumbnailsUrl;
        this.profile.youtubeDescription = data.youtubeDescription;
        this.openSnackBar('更新しました🍕🍕🍕🍕🍕');
      },
      (error: any) => {
        this.openSnackBar('チャンネルIDが間違っています🍺🍺');
      }
    );
  }

  async setProfile(): Promise<void> {
    await this.requestClientService.patchProfile(this.profile).toPromise().then();
    const hasGenres: HasGenreIds = [];
    this.responseFindGenres.forEach((v) =>
      v.items.forEach((d) => {
        if (d.has) {
          hasGenres.push(d.id);
        }
      })
    );
    await this.requestClientService.patchHasGenre(hasGenres).toPromise().then();

    this.requestClientService.profile().subscribe(
      (user) => {
        this.userInfoService.setUserInfo(user.youtubeChannelName);
        this.openSnackBar('保存しました⚡⚡');
      },
      (error: any) => {
        console.log('welcome guest user!!');
      }
    );
  }

  private openSnackBar(message: string): void {
    this.matSnackBar.open(message, '', {
      duration: 3000,
    });
  }

  toggleHasGenre(id: number): void {}

  openWindowsByUser(): void {
    window.open(`${environment.host}/u/${this.profile.youtubeChannelId}`);
  }
}
