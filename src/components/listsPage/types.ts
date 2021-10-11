import { ListCategory } from '../../services/types';
import { List } from '../../store/lists';

export type ListsPageProps = {
  listCategory: ListCategory;
  hidden: boolean;
};

export type ListContainerProps = {
  list: List;
  listCategory: ListCategory;
};

export type ListDescription = {
  name: string;
  description?: string;
};
