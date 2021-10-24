import { ListCategory } from '../../../services/types';
import { List } from '../../../store/lists';

export type ListsPageProps = {
  listCategory: ListCategory;
  hidden: boolean;
};

export type UserMediaCardProps = {
  userMediaId: string;
  listCategory: ListCategory;
  currentListId: string;
  isCompletedList?: boolean;
};

export type ListContainerProps = {
  list: List;
  listCategory: ListCategory;
  isCompletedList?: boolean;
};

export type ListDescription = {
  name: string;
  description?: string;
};

export enum ListCategoryMapToCompleted {
  towatch = 'completed',
  towatchtv = 'completedTv',
  completed = 'completed',
  completedTv = 'completedTv',
}
