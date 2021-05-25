import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ResponseFindGenre } from '../../../dto/genre.dto';
import { RequestUser } from '../../../dto/user.dto';
import { ELiveBroadcastContent, Video } from 'src/app/dto/video.dto';
import { RequestClientService } from 'src/app/service/request-client.service';
import { SeoService } from 'src/app/service/seo.service';
import { DateType, RequestUserTimeSchedules, UserTimeSchedule } from 'src/app/dto/user.time.schedule.dto';
import { RequestUserLinks, ResponseUserLinks } from 'src/app/dto/user.link.dto';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: [
    './user.component.scss',
    '../../edit-profile/_font.scss',
    '../../edit-profile/_gantt.scss',
    '../../edit-profile/_profile.scss',
  ],
})
export class UserComponent implements OnInit {
  youtubeChannelId = '';
  responseFindGenres: ResponseFindGenre[] = [];
  requestUserTimeSchedules: RequestUserTimeSchedules = [];
  requestUserLinks: RequestUserLinks = [];
  videos: Video[] = [];
  user: RequestUser | undefined;
  profileImages: string[] = [];
  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly requestClientService: RequestClientService,
    private readonly seoService: SeoService
  ) {}

  async ngOnInit(): Promise<void> {
    this.youtubeChannelId = this.activatedRoute.snapshot.paramMap.get('youtubeChannelId') + '';
    this.getYoutubeData(this.youtubeChannelId);
    this.getResponseFindGenres();
    this.router.events.subscribe(
      (val) => {
        if (val instanceof NavigationEnd) {
          this.youtubeChannelId = this.activatedRoute.snapshot.paramMap.get('youtubeChannelId') + '';
          this.getYoutubeData(this.youtubeChannelId);
          // genre設定
          this.getResponseFindGenres();
        }
      },
      () => {}
    );
    this.getProfileImage(this.youtubeChannelId);
  }

  private setSeo(): void {
    if (this.user) {
      this.seoService.setUserInfo(
        this.user.youtubeChannelName,
        this.user.youtubeChannelId,
        this.user.youtubeDescription,
        this.user.youtubeThumbnailsUrl
      );
    }
  }

  /**
   * アップロード済みのプロフィール画像を取得する
   * @param youtubeChannelId youtubeChannelId
   */
  getProfileImage(youtubeChannelId: string): void {
    this.requestClientService.getProfileFile(youtubeChannelId).subscribe((images) => {
      this.profileImages = images;
    });
  }

  /**
   * 所持しているgenreを設定する
   */
  async getResponseFindGenres(): Promise<void> {
    await this.requestClientService
      .genre()
      .toPromise()
      .then((data) => {
        this.responseFindGenres = data;
      });
    this.requestClientService.getHasGenreByYoutubeChannelId(this.youtubeChannelId).subscribe((genreIds) => {
      for (const rfg of this.responseFindGenres) {
        for (const r of rfg.items) {
          for (const genreId of genreIds) {
            if (r.id === genreId) {
              r.has = true;
              break;
            }
          }
        }
      }

      for (const rfg of this.responseFindGenres) {
        rfg.items = rfg.items.filter((r) => {
          return r.has;
        });
      }
      this.responseFindGenres = this.responseFindGenres.filter((v) => {
        return v.items.length !== 0;
      });
    });
  }

  changeUser(youtubeChannelId: string): void {
    this.getProfileImage(youtubeChannelId);
    this.getYoutubeData(youtubeChannelId);
  }

  /**
   * APIから`youtubeChannelId`を元にユーザー情報を取得を行う。
   * @param youtubeChannelId youtubeChannelId
   */
  getYoutubeData(youtubeChannelId: string): void {
    this.profileImages = [];
    this.requestClientService.getUser(youtubeChannelId).subscribe(
      (data) => {
        this.user = data;
        this.requestClientService.getLinks(this.user.youtubeChannelId).subscribe((links) => {
          this.requestUserLinks = links;
        });
        this.requestClientService.getTimeSchedule(this.user.youtubeChannelId).subscribe((time) => {
          this.requestUserTimeSchedules = time;
        });
        this.setSeo();
      },
      () => {}
    );
    this.requestClientService.getVideosByUser(youtubeChannelId).subscribe((data) => {
      this.videos = data.map((v) => {
        if (v.description.length >= 100) {
          v.description = v.description.substring(0, 100) + '...';
        }
        return v;
      });
    });
  }

  /**
   * Videoの配信状況または配信時間を返す。
   *
   * @param liveBroadcastContent 配信状態
   * @param duration 配信時間
   */
  htmlFormatDuration(liveBroadcastContent: ELiveBroadcastContent, duration: string | undefined): string {
    if (liveBroadcastContent === ELiveBroadcastContent.live) {
      return 'LIVE';
    }
    if (liveBroadcastContent === ELiveBroadcastContent.upcoming) {
      return '配信予定';
    }
    if (!duration) {
      return '';
    }
    let rtnStr = '';
    const hour = duration
      .match(/\d{1,2}H/)
      ?.toString()
      .match(/\d{1,2}/);
    const minutes = duration
      .match(/\d{1,2}M/)
      ?.toString()
      .match(/\d{1,2}/);
    const second = duration
      .match(/\d{1,2}S/)
      ?.toString()
      .match(/\d{1,2}/);

    if (hour) {
      rtnStr = hour + ':';
    }

    if (rtnStr !== '') {
      if (!minutes) {
        rtnStr += '00:';
      } else {
        if (minutes.toString().length === 1) {
          rtnStr += `0${minutes}:`;
        } else {
          rtnStr += `${minutes}:`;
        }
      }
    } else {
      if (minutes) {
        rtnStr = `${minutes}:`;
      } else {
        rtnStr = '00:';
      }
    }

    if (!second) {
      rtnStr += '00';
    } else {
      if (second.toString().length === 1) {
        rtnStr += `0${second}`;
      } else {
        rtnStr += `${second}`;
      }
    }

    return rtnStr;
  }

  /**
   * 配信時間が正常に設定されているか判断を行う。
   * @param st 配信予定オブジェクト
   * @returns true:正常時間、false:異常時間
   */
  checkTimeByTimeSchedule(req: Omit<UserTimeSchedule, 'id'>, dateType: DateType): boolean {
    if (!req.dayType) {
      return false;
    }
    if (req.dayType !== dateType) {
      return false;
    }
    if (Number.isInteger(req.startTime) && Number.isInteger(req.endTime)) {
      return true;
    }
    return false;
  }
}
