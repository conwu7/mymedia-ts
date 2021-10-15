import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { updateList } from '../../../../services/api';
import { UpdateListBody } from '../../../../services/types';
import { UpdateListSchema } from '../../../../services/validation';
import { FormTextField } from '../../../onboardingPage/userForm/UserForm';
import ErrorFieldContainer from '../../../utils/errorFieldContainer/ErrorFieldContainer';
import Loading from '../../../utils/loading/Loading';
import style from './style.module.scss';
import { EditListFormProps } from './types';

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
        updatedList: result,
      });
      props.onClose();
    },
  });
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
