import { createDate } from './dto';

export type Genre = {
  // ユニークなID(DBから自動生成)
  id: number;
  // ジャンル
  name: string;
  // update User
  updateUser: string;
  // 表示順
  displayNo: number;
} & createDate;

export type RequestFindOne = Pick<Genre, 'name'>;

export type RequestGenre = Pick<Genre, 'name' | 'updateUser'> | Pick<Genre, 'name' | 'updateUser' | 'displayNo'>;

export type RequestGenres = RequestGenre[];
