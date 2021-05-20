
export type UserLink = {
  id: number;
  name: string;
  url: string;
  sort: number;
};

/**
 * アップロードした画像
 */
export type UserLinks = UserLink[];

export type RequestUserLinks = Omit<UserLink, 'id'>[];

export type ResponseUserLinks = RequestUserLinks;
