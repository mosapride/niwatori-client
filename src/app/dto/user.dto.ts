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
} & createDate &
  GoogleOAuth;

export type GoogleOAuth = {
  accessToken: string;
  exp: Date;
};

export enum UserRole {
  ADMIN = 'admin',
  ACTIVE = 'active',
  BAN = 'ban',
  IN_ACTIVE = 'inactive',
}

export type RequestUser = Pick<User, 'youtubeChannelName' | 'youtubeThumbnailsUrl' | 'youtubeChannelId'>;

/**
 * 情報更新ユーザー情報
 */
export type RequestUpdateUser = Omit<User, 'id' | 'isActive' | 'createAt' | 'updateAt'>;

/**
 * JWT形式。
 */
export type AuthJwtHash = Pick<User, 'youtubeChannelId'> & { updatedAt: Date };

/**
 * ハッシュ化したデータのJWT形式。
 */
export type EncryptionAuthJwtHash = Pick<User, 'youtubeChannelId'> & { updatedAt: string; iv?: string };

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

export type ResponseYoutubeInfo = Pick<User, 'youtubeChannelId' | 'youtubeThumbnailsUrl' | 'youtubeChannelName' | 'youtubeDescription'>;

export type RequestCreateUserByGoogle = Pick<User, 'youtubeChannelId' | 'youtubeChannelName' | 'accessToken'>;

/**
 * Youtube Data API OAuth認証からのユーザー作成データ
 */
export type RequestCreateUserByYoutubeDataApi = Pick<
  User,
  'youtubeChannelId' | 'youtubeChannelName' | 'youtubeDescription' | 'youtubeThumbnailsUrl' | 'accessToken'
>;
