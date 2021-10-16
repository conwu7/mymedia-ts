import { FormikHandlers, FormikValues } from 'formik';
import { ListCategory, UpdateListBody } from '../../../../services/types';

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
  error: string | undefined;
};
