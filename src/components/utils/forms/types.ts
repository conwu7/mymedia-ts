import { FormikHandlers, FormikValues } from 'formik';
import { ListCategory, UpdateListBody } from '../../../services/types';

export interface EditListFormProps extends UpdateListBody {
  onClose: () => void;
  listCategory: ListCategory;
  listId: string;
}

export interface NewListFormProps {
  onClose: () => void;
  listCategory: ListCategory;
}

export type ListFormProps = {
  formik: FormikHandlers & FormikValues;
  isLoading: boolean;
  error?: string;
};

export interface PreferencesFormProps {
  onClose: () => void;
}

export type AddMediaNotesFormProps = {
  onClose: () => void;
  listCategory: ListCategory;
  imdbId: string;
  toWatchNotes?: string;
};

export type ReviewUserMediaFormProps = {
  onClose: (action?: string) => void;
  listCategory: ListCategory;
  imdbId: string;
  reviewNotes?: string;
  userRating?: number;
  hideCompleteButton?: boolean;
};
