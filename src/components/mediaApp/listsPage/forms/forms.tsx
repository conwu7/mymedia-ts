import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { createList, updateList } from '../../../../services/api';
import { UpdateListBody } from '../../../../services/types';
import { UpdateListSchema } from '../../../../services/validation';
import { FormTextField } from '../../../onboardingPage/userForm/UserForm';
import ErrorFieldContainer from '../../../utils/errorFieldContainer/ErrorFieldContainer';
import Loading from '../../../utils/loading/Loading';
import style from './style.module.scss';
import { EditListFormProps, ListFormProps, NewListFormProps } from './types';

export function EditListForm(props: EditListFormProps): JSX.Element {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const initialValues: UpdateListBody = {
    listName: props.listName,
    description: props.description || '',
  };
  const dispatch: Dispatch = useDispatch();

  const formik = useFormik({
    initialValues,
    validationSchema: UpdateListSchema,
    onSubmit: async (values: UpdateListBody) => {
      setIsLoading(true);
      const { err, result } = await updateList(values, props.listCategory, props.listId);
      setIsLoading(false);
      if (err) return setError(err);
      dispatch({
        type: 'updateList',
        listType: props.listCategory,
        list: result,
      });
      props.onClose();
    },
  });
  return <ListForm formik={formik} isLoading={isLoading} error={error} />;
}

export function NewListForm(props: NewListFormProps): JSX.Element {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const initialValues: UpdateListBody = {
    listName: '',
    description: '',
  };
  const dispatch: Dispatch = useDispatch();

  const formik = useFormik({
    initialValues,
    validationSchema: UpdateListSchema,
    onSubmit: async (values: UpdateListBody) => {
      setIsLoading(true);
      const { err, result } = await createList(values, props.listCategory);
      setIsLoading(false);
      if (err) return setError(err);
      dispatch({
        type: 'createList',
        listType: props.listCategory,
        list: result,
      });
      props.onClose();
    },
  });

  return <ListForm formik={formik} isLoading={isLoading} error={error} />;
}

function ListForm({ formik, isLoading, error }: ListFormProps): JSX.Element {
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <FormTextField label="List Name" name={'listName'} formik={formik} required={true} isMultiLine={true} />
      <FormTextField
        label="Description"
        name={'description'}
        formik={formik}
        required={false}
        showErrorImmediately={true}
        isMultiLine={true}
      />
      <ErrorFieldContainer showError={Boolean(error)} errorMessage={error} />
      <Button
        onClick={formik.submitForm}
        className={style.submitBtn}
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Save
      </Button>
      <Loading isLoading={isLoading} />
    </Box>
  );
}
