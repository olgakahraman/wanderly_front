import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import AuthButton from './AuthButton.jsx';
import styles from './AuthForm.module.css';
import AuthInput from './AuthInput.jsx';

const getValidationSchema = type => {
  const base = {
    email: yup.string().email('Invalid email').required('Email is required'),
  };

  const login = {
    ...base,
    password: yup
      .string()
      .min(6, 'Minimum 6 characters')
      .required('Password is required'),
  };

  const register = {
    ...login,
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Confirm your password'),
  };

  if (type === 'login') return yup.object(login);
  if (type === 'register') return yup.object(register);
  if (type === 'forgot-password') return yup.object(base);

  return yup.object();
};

const AuthForm = ({ type, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(getValidationSchema(type)),
  });

  const internalSubmit = data => {
    onSubmit?.(data);
  };

  return (
    <form
      className={`d-flex flex-column align-items-center ${styles.form}`}
      onSubmit={handleSubmit(internalSubmit)}
      noValidate
    >
      <div className={styles.formWrapper}>
        {(type === 'login' ||
          type === 'register' ||
          type === 'forgot-password') && (
          <>
            <AuthInput
              name='email'
              type='email'
              placeholder='Email'
              register={register}
              error={errors.email?.message}
            />
          </>
        )}

        {(type === 'login' || type === 'register') && (
          <AuthInput
            name='password'
            type='password'
            placeholder='Password'
            register={register}
            error={errors.password?.message}
          />
        )}

        {type === 'register' && (
          <AuthInput
            name='confirmPassword'
            type='password'
            placeholder='Confirm Password'
            register={register}
            error={errors.confirmPassword?.message}
          />
        )}

        <AuthButton type='submit'>
          {type === 'login' && 'Let`s Go'}
          {type === 'register' && 'Start Wandering'}
          {type === 'forgot-password' && 'Reset Password'}
        </AuthButton>
      </div>
    </form>
  );
};

export default AuthForm;
