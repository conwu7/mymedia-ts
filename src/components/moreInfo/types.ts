export type MoreInfoMedia = {
  title?: string;
  imdbID: string;
  plot?: string;
  posterUrl?: string;
  runtime?: number;
  runYears?: string;
  genre?: string[];
  imdbRating?: number;
  releaseDate?: string;
  actors?: string[];
  totalSeasons?: number;
  language?: string[];
};
export type MoreInfoCardProps = {
  media: MoreInfoMedia;
  userMedia?: MediaReview;
};

export type MediaReview = {
  userRating?: number;
  toWatchNotes?: string;
  reviewNotes?: string;
};
