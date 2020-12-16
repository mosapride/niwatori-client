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
  // discord
  discord: string;
  // ハッシュ化されたパスワード
  password: string;
  // 平文パスワード(デバック用で運用では実装してはいけない)
  plainPassword: string;
  // emailアドレス
  email: string;
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

export type ResponseUserInfo = Pick<User, 'name' | 'email'>;

export type RequestUserProfile = Pick<User, 'name' | 'youtubeChannelName' | 'youtubeChannelId' | 'selfIntroduction' | 'twitter'>;

/**
 * ユーザー情報作成DTO
 */
export type RequestCreateUser = Pick<User, 'name' | 'password' | 'email'>;

export type RequestCreateUserByGoogle = Pick<User, 'name' | 'email' | 'accessToken'>;

/**
 * レスポンス用ユーザー情報
 */
export type ResponseUser = Pick<User, 'name' | 'email'>;

/**
 * 情報更新ユーザー情報
 */
export type RequestUpdateUser = Omit<User, 'id' | 'isActive' | 'createAt' | 'updateAt'>;

/**
 * JWT形式。
 */
export type AuthJwtHash = {
  email: string;
  updatedAt: Date;
};

/**
 * ハッシュ化したデータのJWT形式。
 */
export type EncryptionAuthJwtHash = {
  email: string;
  updatedAt: string;
  iv?: string;
};

/**
 * クライアントの入力可能Profile情報
 */
export type RequestProfile = Pick<
  User,
  'youtubeChannelId' | 'youtubeThumbnailsUrl' | 'youtubeChannelName' | 'youtubeDescription' | 'name' | 'nameKatakana' | 'twitter' | 'selfIntroduction'
>;

export type ResponseYoutubeInfo = Pick<User, 'youtubeThumbnailsUrl' | 'youtubeChannelName' | 'youtubeDescription'>;
