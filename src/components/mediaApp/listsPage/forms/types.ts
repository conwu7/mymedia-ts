import { ListCategory, UpdateListBody } from '../../../../services/types';

export interface EditListFormProps extends UpdateListBody {
  onClose: () => void;
  listCategory: ListCategory;
  listId: string;
}
