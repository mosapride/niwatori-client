import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { RequestUser } from 'src/app/dto/user.dto';
import { ELiveBroadcastContent, Video } from 'src/app/dto/video.dto';
import { RequestClientService } from 'src/app/service/request-client.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  youtubeChannelId = '';
  videos: Video[] = [];
  user: RequestUser | undefined;
  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly requestClientService: RequestClientService
  ) {}

  ngOnInit(): void {
    this.youtubeChannelId = this.activatedRoute.snapshot.paramMap.get('youtubeChannelId') + '';
    this.getYoutubeData(this.youtubeChannelId);
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.youtubeChannelId = this.activatedRoute.snapshot.paramMap.get('youtubeChannelId') + '';
        this.getYoutubeData(this.youtubeChannelId);
      }
    });
  }

  changeUser(youtubeChannelId: string): void {
    this.getYoutubeData(youtubeChannelId);
  }

  /**
   * APIから`youtubeChannelId`を元にユーザー情報を取得を行う。
   * @param youtubeChannelId youtubeChannelId
   */
  getYoutubeData(youtubeChannelId: string): void {
    this.requestClientService.getUser(youtubeChannelId).subscribe((data) => {
      this.user = data;
    });
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
}
