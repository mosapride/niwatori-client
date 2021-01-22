import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ResponseFindGenre } from 'src/app/dto/genre.dto';
import { RequestProfile } from 'src/app/dto/user.dto';
import { HasGenreIds } from 'src/app/dto/user.genre.dto';
import { RequestClientService } from 'src/app/service/request-client.service';
import { UserInfoService } from 'src/app/service/user-info.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss', '../../util/lightbox-img-grid/lightbox-img-grid.component.scss'],
})
export class ProfileComponent implements OnInit {
  profile: RequestProfile = {};
  imgBaseUrl: string;
  // アップロード済み画像名
  profileImages: string[] = [];
  // アップロードする画像のローカルURL
  uploadProfileLocalUrl: SafeUrl[] = [];
  uploadProfileFiles: File[] = [];
  imageDropActiveFlg = false;
  /** 画像アップロード中か？ */
  uploading = false;
  responseFindGenres: ResponseFindGenre[] = [];
  constructor(
    private readonly domSanitizer: DomSanitizer,
    private readonly requestClientService: RequestClientService,
    private readonly userInfoService: UserInfoService,
    private matSnackBar: MatSnackBar
  ) {
    this.imgBaseUrl = environment.imageUrl;
  }

  async ngOnInit(): Promise<void> {
    await this.requestClientService.profile().subscribe((data) => {
      this.profile = data;
      if (this.profile.youtubeChannelId) {
        this.getProfileImage(this.profile.youtubeChannelId);
      }
    });
    await this.requestClientService.genre().subscribe((data) => {
      this.responseFindGenres = data;
      this.checkGenre();
    });
  }

  /**
   * アップロード済みのプロフィール画像を取得する
   * @param youtubeChannelId youtubeChannelId
   */
  getProfileImage(youtubeChannelId?: string): void {
    if (!youtubeChannelId) {
      if (this.profile.youtubeChannelId) {
        youtubeChannelId = this.profile.youtubeChannelId;
      } else {
        // 通常ここは通らない。
        // 未ログインではこのページには遷移しないため、不正なログインにて表示させている可能性がある。
        return;
      }
    }
    this.requestClientService.getProfileFile(youtubeChannelId).subscribe((images) => {
      this.profileImages = images;
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

  openWindowsByUser(): void {
    window.open(`${environment.host}/u/${this.profile.youtubeChannelId}`);
  }

  fileView(event: DragEvent | any): void {
    let files: FileList | undefined;

    try {
      // divでのfilesの箇所
      if (event && event instanceof DragEvent) {
        event.stopPropagation();
        event.preventDefault();
        files = event.dataTransfer?.files;
      } else {
        // inputでのfilesの箇所
        files = event.target.files;
      }
    } catch (e) {}

    if (!files) {
      return;
    }
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.type === 'image/png' || f.type === 'image/jpeg') {
        this.addUploadProfile(f);
      }
    }
    this.imageDropActiveFlg = false;
  }

  handleDragOver(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
  }

  imageUpload(): void {
    if (this.uploadProfileFiles.length !== 0) {
      this.uploading = true;
      this.requestClientService.uploadProfileFile(this.uploadProfileFiles).subscribe(() => {
        this.clearUploadProfile();
        this.getProfileImage();
        this.uploading = false;
      });
    }
  }

  /**
   * 画面に表示する画像データの追加
   * @param file 画像データ
   */
  addUploadProfile(file: File): void {
    this.uploadProfileFiles.push(file);
    this.uploadProfileLocalUrl.push(this.domSanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file)));
  }

  /**
   * 画面に表示している画像をすべてクリア
   */
  clearUploadProfile(): void {
    this.uploadProfileFiles = [];
    this.uploadProfileLocalUrl = [];
  }

  /**
   * 画面に表示している画像データの削除
   * @param index 削除する画像データのindex番号
   */
  spliceUploadProfile(index: number): void {
    this.uploadProfileFiles.splice(index, 1);
    this.uploadProfileLocalUrl.splice(index, 1);
  }

  deleteImg(fileName: string): void {
    this.requestClientService.deleteProfileFile(fileName).subscribe(() => {
      this.getProfileImage();
    });
  }

  isDisabledUpload(): boolean {
    if (this.uploading) {
      return false;
    }
    if (this.uploadProfileLocalUrl.length >= 1 && this.uploadProfileLocalUrl.length + this.profileImages.length <= 10) {
      return false;
    }
    return true;
  }
}
