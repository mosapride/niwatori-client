export interface YoutubeApiVideos {
    kind: string;
    etag: string;
    items: Item[];
    pageInfo: PageInfo;
  }

  interface PageInfo {
    totalResults: number;
    resultsPerPage: number;
  }

  interface Item {
    kind: string;
    etag: string;
    id: string;
    snippet: Snippet;
    contentDetails: ContentDetails;
    statistics: Statistics;
    liveStreamingDetails?: LiveStreamingDetails;
  }

  interface LiveStreamingDetails {
    actualStartTime: string;
    actualEndTime: string;
    scheduledStartTime: string;
  }

  interface Statistics {
    viewCount: string;
    likeCount: string;
    dislikeCount: string;
    favoriteCount: string;
    commentCount: string;
  }

  interface ContentDetails {
    duration: string;
    dimension: string;
    definition: string;
    caption: string;
    licensedContent: boolean;
    contentRating: ContentRating;
    projection: string;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface ContentRating {
  }

  interface Snippet {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: Thumbnails;
    channelTitle: string;
    tags?: string[];
    categoryId: string;
    liveBroadcastContent: string;
    localized: Localized;
    defaultAudioLanguage?: string;
    defaultLanguage?: string;
  }

  interface Localized {
    title: string;
    description: string;
  }

  interface Thumbnails {
    default: Default;
    medium: Default;
    high: Default;
    standard: Default;
    maxres: Default;
  }

  interface Default {
    url: string;
    width: number;
    height: number;
  }
