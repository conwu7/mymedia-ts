import { ListCategory } from '../../../services/types';
import { MediaInstants } from '../../../store/lists';

export interface ListSelectorProps {
  modalTitle?: string;
  listCategory: ListCategory;
  imdbId: string;
  onSelect: (selection: string) => void;
}

export interface ListSelectorModalProps extends ListSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selection: string) => Promise<void>;
}

export type ListWithSelectButtonStatus = {
  isPrivate: boolean;
  _id: string;
  name: string;
  description?: string;
  mediaInstants: MediaInstants[];
  createdAt: string;
  updatedAt: string;
  disableSelectList?: boolean;
};
