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
  liveStreamingDetails: LiveStreamingDetails;
}

interface LiveStreamingDetails {
  scheduledStartTime: string;
  actualStartTime : string;
  activeLiveChatId: string;
}
