import { SyntheticEvent } from 'react';

export type OnboardingPages = 'home' | 'login' | 'signup';
export enum OnboardingPagesDisplayText {
  home = 'Preview',
  login = 'Log in',
  signup = 'Sign up',
}
export type HandlePageChange = (event: SyntheticEvent, newPage: OnboardingPages) => void;
