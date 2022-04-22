interface YoutubeAuth {
  accessToken: string;
  refreshToken: string;
  profile: Profile;
}

interface Profile {
  provider: string;
  id: string;
  displayName: string;
  _raw: string;
  _json: Json;
}

interface Json {
  kind: string;
  etag: string;
  pageInfo: PageInfo;
  items: Item[];
}

interface Item {
  kind: string;
  etag: string;
  id: string;
  snippet: Snippet;
}

interface Snippet {
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: Thumbnails;
  localized: Localized;
  country: string;
}

interface Localized {
  title: string;
  description: string;
}

interface Thumbnails {
  default: Default;
  medium: Default;
  high: Default;
}

interface Default {
  url: string;
  width: number;
  height: number;
}

interface PageInfo {
  totalResults: number;
  resultsPerPage: number;
}
