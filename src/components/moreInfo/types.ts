import { SyntheticEvent } from 'react';

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
  hideReviewTab?: boolean;
  media: MoreInfoMedia;
  userMedia: MediaReview;
};
export type MoreInfoTabs = 'info' | 'review';
export enum MoreInfoTabsDisplay {
  info = 'More Info',
  review = 'Notes & Review',
}
export type HandleTabChange = (event: SyntheticEvent, newTab: MoreInfoTabs) => void;

export type MediaReview = {
  userRating?: number;
  toWatchNotes?: string;
  reviewNotes?: string;
};

export type MediaReviewCardProps = {
  userMedia?: MediaReview;
};
