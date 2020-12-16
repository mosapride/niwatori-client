interface YoutubeApiChannel {
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
  /** チャンネル名 */
  title: string;
  /** 概要 */
  description: string;
  publishedAt: string;
  /** サムネイル */
  thumbnails: Thumbnails;
  localized: Localized;
  country: string;
}

interface Localized {
  title: string;
  description: string;
}

interface Thumbnails {
  /** サムネイル - 標準 */
  default: Default;
  /** サムネイル - 中 */
  medium: Default;
  /** サムネイル - 大 */
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
