import { createDate } from './dto';

export type Genre = {
  // ユニークなID(DBから自動生成)
  id: number;
  // 環境
  environment: GenreEnvironment;
  // ジャンル
  name: string;
  // update User
  updateUser: string;
} & createDate;

export enum GenreEnvironment {
  PC = 'PC',
  PS4 = 'PS4',
  PS5 = 'PS5',
  SWITCH = 'Switch',
  OTHER = 'その他',
}

export type ResponseFindGenreItem = { items: { id: number; name: string; count?: number; has?: boolean }[] };

/**
 * 画面表示用にすべてのジャンルを返す。
 *
 * select * from genre order by environment , name;
 */
export type ResponseFindGenre = Pick<Genre, 'environment'> & ResponseFindGenreItem;

/**
 * 所有しているジャンルリスト
 */
export type activeGenres = { id: number[] };

/**
 * 登録用DTO
 */
export type RequestGenre = Pick<Genre, 'environment' | 'name' | 'updateUser'>;

/**
 * 登録用DTO
 */
export type RequestGenres = RequestGenre[];
