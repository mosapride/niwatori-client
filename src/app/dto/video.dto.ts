import { createDate } from './dto';

export type Video = {
  id: number;
  // チャンネルID snippet.channelId
  channelId: string;
  // チャンネル名 snippet.channelTitle
  channelTitle: string;
  // 動画タイトル snippet.title
  title: string;
  // サムネイルURL snippet.thumbnails.medium.url
  thumbnailUrl: string;
  // 配信状態
  //   "liveBroadcastContent": "upcoming", ライブ配信予定
  //   "liveBroadcastContent": "live",     ライブ配信中
  //   "liveBroadcastContent": "none",     ビデオ
  liveBroadcastContent: ELiveBroadcastContent;

  /**
   * 配信日/配信予定日.
   *
   * ## API /youtube/v3/を使用
   * snippet.publishedAt
   *
   * ## detail liveBroadcastContentの状態により変化する
   * upcoming = liveStreamingDetails.scheduledStartTime(配信予定時刻)
   * live = liveStreamingDetails.actualStartTime (配信開始時刻)
   * none = liveStreamingDetails.actualStartTime (配信開始)
   */
  streamAt: Date;
  // ビデオID id.videoId
  videoId: string;
  // 配信日
} & createDate;

export enum ELiveBroadcastContent {
  upcoming = 'upcoming',
  live = 'live',
  none = 'none',
}
