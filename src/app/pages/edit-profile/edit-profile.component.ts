import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser';
import { ResponseFindGenre } from 'src/app/dto/genre.dto';
import { User, UserRole } from 'src/app/dto/user.dto';
import { HasGenreIds } from 'src/app/dto/user.genre.dto';
import { RequestClientService } from 'src/app/service/request-client.service';
import { UserInfoService } from 'src/app/service/user-info.service';
import { environment } from 'src/environments/environment';
import { ConfirmDialogComponent, DialogData } from 'src/app/pages/util/confirm-dialog/confirm-dialog.component';
import { DateType, RequestUserTimeSchedules, ResponseUserTimeSchedules, UserTimeSchedule } from 'src/app/dto/user.time.schedule.dto';
import { RequestUserLinks, ResponseUserLinks, UserLink } from 'src/app/dto/user.link.dto';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  profile: Partial<User> = {};
  requestUserTimeSchedules: Omit<Partial<UserTimeSchedule>, 'id'>[] = [];
  requestUserLinks: Omit<Partial<UserLink>, 'id'>[] = [];
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
    private readonly titleService: Title,
    private readonly domSanitizer: DomSanitizer,
    private readonly requestClientService: RequestClientService,
    private readonly userInfoService: UserInfoService,
    private matSnackBar: MatSnackBar,
    private readonly dialog: MatDialog
  ) {
    this.imgBaseUrl = environment.imageUrl;
  }

  ngOnInit(): void {
    this.titleService.setTitle('プロフィール編集 - 箱庭');
    // debugger;
    this.requestClientService.profile().subscribe((data) => {
      this.profile = data;
      if (this.profile.youtubeChannelId) {
        this.getProfileImage(this.profile.youtubeChannelId);
      }
      if (data.role === UserRole.IN_ACTIVE) {
        this.requestClientService.updateVideos().subscribe(() => {
          this.requestClientService.updateRole(UserRole.ACTIVE).subscribe();
        });
      }
      if (this.profile.youtubeChannelId) {
        this.requestClientService.getTimeSchedule(this.profile.youtubeChannelId).subscribe((time: ResponseUserTimeSchedules) => {
          this.requestUserTimeSchedules = time;
          const timeLen = this.requestUserTimeSchedules.length;
          for (let i = timeLen; i < 4; i++) {
            const weekDayCnt = this.requestUserTimeSchedules.reduce((previousValue, currentValue) => {
              if (currentValue.dayType && currentValue.dayType === 'weekdays') {
                previousValue++;
              }
              return previousValue;
            }, 0);
            if (weekDayCnt < 2) {
              this.requestUserTimeSchedules.push({ dayType: 'weekdays' });
            } else {
              this.requestUserTimeSchedules.push({ dayType: 'holidays' });
            }
          }
          this.requestUserTimeSchedules.sort((a, b) => {
            if (a.dayType === 'weekdays') {
              if (a.dayType === b.dayType) {
                return 0;
              }
              return -1;
            }
            return 1;
          });
        });

        this.requestClientService.getLinks(this.profile.youtubeChannelId).subscribe((link: ResponseUserLinks) => {
          this.requestUserLinks = link;
          const linksLen = this.requestUserLinks.length;
          for (let i = linksLen; i < 5; i++) {
            this.requestUserLinks.push({sort : i});
          }
          console.log(this.requestUserLinks)
        });
      }
    });
    this.requestClientService.genre().subscribe((data) => {
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

    console.log(this.requestUserLinks);
    // カスタムリンク
    const rul: RequestUserLinks = [];
    let index = 0;
    for (const ul of this.requestUserLinks) {
      if (ul.name && ul.url) {
        rul.push({ name: ul.name, sort: index++, url: ul.url });
      }
    }
    console.log(rul);
    await this.requestClientService.postLinks(rul).toPromise().then();

    // 配信時間
    const rts: RequestUserTimeSchedules = [];
    for (const ruts of this.requestUserTimeSchedules) {
      if (ruts.dayType && ruts.endTime && ruts.startTime) {
        rts.push({ dayType: ruts.dayType, endTime: ruts.endTime, startTime: ruts.startTime });
      }
    }
    await this.requestClientService.postTimeSchedule(rts).toPromise().then();

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
      return true;
    }
    if (this.uploadProfileLocalUrl.length >= 1 && this.uploadProfileLocalUrl.length + this.profileImages.length <= 10) {
      return false;
    }

    return true;
  }

  withDrawal(): void {
    const confirmDialog = this.dialog.open<ConfirmDialogComponent, DialogData, boolean | undefined>(ConfirmDialogComponent, {
      data: { title: '確認', message: 'すべてのデータを削除し退会します。' },
    });

    confirmDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.requestClientService.withDrawal();
      }
    });
  }

  /**
   * 配信時間の曜日種別を日本語文字列で返す。
   * @param dayType 日付種別
   * @returns 曜日種別
   */
  showDay(dayType?: DateType): string {
    if (dayType === 'weekdays') {
      return '平日';
    }
    return '休日';
  }

  /**
   * 配信時間が正常に設定されているか判断を行う。
   * @param st 配信予定オブジェクト
   * @returns true:正常時間、false:異常時間
   */
  checkTimeByTimeSchedule(st: Omit<Partial<UserTimeSchedule>, 'id'>, dateType: DateType): boolean {
    if (!st.dayType) {
      return false;
    }
    if (st.dayType !== dateType) {
      return false;
    }
    if (Number.isInteger(st.startTime) && Number.isInteger(st.endTime)) {
      return true;
    }
    return false;
  }
}
