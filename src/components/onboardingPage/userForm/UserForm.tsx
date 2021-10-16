import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useFormik } from 'formik';
import { useState } from 'react';
import { login, signup } from '../../../services/api';
import { LoginBody, SignupBody } from '../../../services/types';
import ErrorFieldContainer from '../../utils/errorFieldContainer/ErrorFieldContainer';
import style from './style.module.scss';
import { FormTextFieldProps, UserFormBody, UserFormProps, UserFormSchema, UserFormTypeDisplay } from './types';

export default function UserForm({ action }: UserFormProps): JSX.Element {
  const [error, setError] = useState('');
  const initialValues: UserFormBody = {
    username: '',
    password: '',
    email: action === 'signup' ? '' : undefined,
  };

  const formik = useFormik({
    initialValues,
    validationSchema: UserFormSchema[action],
    onSubmit: async (values: UserFormBody) => {
      let err: string;
      let status: number;
      if (action === 'login') {
        ({ err, status } = await login({ body: values } as { body: LoginBody }));
      } else {
        ({ err, status } = await signup({ body: values } as { body: SignupBody }));
      }
      if (status === 200) return window.location.reload();
      setError(err);
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'darkslategray' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {UserFormTypeDisplay[action]}
        </Typography>
        <Box className={style.userForm} component="form" onSubmit={formik.handleSubmit} noValidate>
          {/*Username*/}
          <FormTextField name="username" label="Username" formik={formik} />
          {/*Email*/}
          {action === 'signup' && <FormTextField name="email" label="Email" formik={formik} />}
          {/*Password*/}
          <FormTextField name="password" label="Password" formik={formik} />
          <ErrorFieldContainer showError={true} errorMessage={error} />
          <Button type="submit" className={style.submitBtn} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            {UserFormTypeDisplay[action]}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export function FormTextField({
  label,
  name,
  formik,
  required,
  showErrorImmediately,
  isMultiLine,
}: FormTextFieldProps): JSX.Element {
  return (
    <Box className={style.textFieldContainer}>
      <TextField
        autoComplete={name}
        fullWidth
        sx={{ m: 1 }}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        id={name}
        label={label}
        margin="normal"
        name={name}
        required={required}
        type={name === 'password' ? 'password' : undefined}
        value={formik.values[name]}
        multiline={isMultiLine}
        className={style.formTextField}
      />
      <ErrorFieldContainer
        showError={!!formik.touched[name] || !!showErrorImmediately}
        errorMessage={formik.errors[name]}
      />
    </Box>
  );
}
