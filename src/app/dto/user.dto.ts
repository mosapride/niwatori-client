import { createDate } from './dto';

/**
 * userテーブル定義DTO
 */
export type User = {
  // ユニークなID(DBから自動生成)
  id: number;
  // 名前
  name: string;
  // カタカナでの名前
  nameKatakana: string;
  // コラボ相手用の自己紹介
  selfIntroduction: string;
  // youtubeチャンネルID
  // https://www.youtube.com/channel/{{channnelId}} でトップに飛べる。
  // see : https://www.youtube.com/account_advanced
  // youtube channel id
  youtubeChannelId: string;
  // youtube channel name
  youtubeChannelName: string;
  // youtube description
  youtubeDescription: string;
  // youtube サムネイル
  youtubeThumbnailsUrl: string;
  // twitter
  twitter: string;
  // アクティブフラグ
  role: UserRole;

  // hiddenSubscriberCount,viewCount,subscriberCount,videoCountの公開情報
  // false = 公開,true = 非公開
  hiddenSubscriberCount: boolean;
  // 総再生数
  viewCount?: number;
  // チャンネル投稿者数
  subscriberCount?: number;
  // 動画数
  videoCount?: number;

  authUpdatedAt: Date;
  // 最新投稿日付
  latestPostVideoAt: Date;
} & createDate &
  GoogleOAuth;

export type GoogleOAuth = {
  accessToken: string;
  refreshToken: string;
};

export enum UserRole {
  ADMIN = 'admin',
  ACTIVE = 'active',
  BAN = 'ban',
  IN_ACTIVE = 'inactive',
}

/**
 * `/u`にて利用するユーザー一覧情報
 */
export type RequestUserList = Pick<
  User,
  | 'youtubeChannelName'
  | 'youtubeThumbnailsUrl'
  | 'youtubeChannelId'
  | 'hiddenSubscriberCount'
  | 'viewCount'
  | 'subscriberCount'
  | 'videoCount'
  | 'twitter'
  | 'latestPostVideoAt'
  | 'createdAt'
>;

/**
 * `/u/:channelId`から取得するデータ
 */
export type RequestUser = Omit<User, 'id' | 'role' | 'createdAt' | 'updatedAt' | 'accessToken' | 'authUpdatedAt' | 'exp' | 'refreshToken'>;

/**
 * 情報更新ユーザー情報
 */
export type RequestUpdateUser = Omit<User, 'id' | 'isActive' | 'createAt' | 'updateAt'>;

/**
 * JWT形式。
 */
export type AuthJwtHash = Pick<User, 'youtubeChannelId'> & { authUpdatedAt: Date };

/**
 * ハッシュ化したデータのJWT形式。
 */
export type EncryptionAuthJwtHash = Pick<User, 'youtubeChannelId'> & { authUpdatedAt: string; iv?: string };

/**
 * クライアントの入力可能Profile情報
 */
export type RequestProfile = Partial<
  Pick<
    User,
    | 'youtubeChannelId'
    | 'youtubeThumbnailsUrl'
    | 'youtubeChannelName'
    | 'youtubeDescription'
    | 'name'
    | 'nameKatakana'
    | 'twitter'
    | 'selfIntroduction'
  >
>;

export type ResponseProfilePick = Pick<
  User,
  | 'youtubeChannelId'
  | 'youtubeThumbnailsUrl'
  | 'youtubeChannelName'
  | 'youtubeDescription'
  | 'name'
  | 'nameKatakana'
  | 'twitter'
  | 'selfIntroduction'
>;

/**
 * YOUTUBE DATA APIから取得するデータ
 */
export type ResponseYoutubeInfo = Pick<
  User,
  | 'youtubeChannelId'
  | 'youtubeThumbnailsUrl'
  | 'youtubeChannelName'
  | 'youtubeDescription'
  | 'hiddenSubscriberCount'
  | 'viewCount'
  | 'subscriberCount'
  | 'videoCount'
>;

export type RequestCreateUserByGoogle = Pick<User, 'youtubeChannelId' | 'youtubeChannelName' | 'accessToken'>;

/**
 * Youtube Data API OAuth認証からのユーザー作成データ
 */
export type RequestCreateUserByYoutubeDataApi = Pick<
  User,
  'youtubeChannelId' | 'youtubeChannelName' | 'youtubeDescription' | 'youtubeThumbnailsUrl' | 'accessToken' | 'refreshToken'
>;

export type RequestProfileUser = Pick<User, 'youtubeChannelId' | 'youtubeChannelName' | 'youtubeThumbnailsUrl'>;

export type RequestProfileUsers = { users: RequestProfileUser[]; page: number; next: boolean };

/**
 * 最新動画日時を書き込みするための型
 */
export type StreamAtPatch = Pick<User, 'youtubeChannelId' | 'latestPostVideoAt'>;
