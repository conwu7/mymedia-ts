import { FormikHandlers, FormikValues } from 'formik';
import { LoginBody, SignupBody } from '../../../services/types';
import { LoginSchema, SignUpSchema } from '../../../services/validation';

export type UserFormProps = {
  action: 'login' | 'signup';
};

export type FormTextFieldProps = {
  label: string;
  name: string;
  formik: FormikHandlers & FormikValues;
  required?: boolean;
  showErrorImmediately?: boolean;
  isMultiLine?: boolean;
  minRows?: number;
};

export type UserFormBody = LoginBody | SignupBody;

export enum UserFormTypeDisplay {
  login = 'Log in',
  signup = 'Sign up',
}

export const UserFormSchema = {
  login: LoginSchema,
  signup: SignUpSchema,
};
