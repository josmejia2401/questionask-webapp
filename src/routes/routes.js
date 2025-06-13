// src/routes/routes.js
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import AuthLayout from '../layouts/auth/index';
import MainLayout from '../layouts/main/index';

// Lazy load de páginas
const NotFoundPage = lazy(() => import('../pages/not-found'));
const LoginPage = lazy(() => import('../features/auth/login'));
const RegisterPage = lazy(() => import('../features/auth/register'));
const DashboardPage = lazy(() => import('../features/dashboard'));
const EditProfilePage = lazy(() => import('../features/profile/user-profile'));
const CreateFormPage = lazy(() => import('../features/forms/create'));
const ViewFormPage = lazy(() => import('../features/forms/view'));
const EditFormPage = lazy(() => import('../features/forms/edit'));
const FormResponsePage = lazy(() => import('../features/forms/form-responses'));
const PublicFormQuestionPage = lazy(() => import('../features/forms/public/form-questions'));

const routes = [
  {
    path: '/',
    element: <Navigate to="/auth/login" />,
  },
  {
    path: '/auth/login',
    element: <AuthLayout><LoginPage /></AuthLayout>,
  },
  {
    path: '/auth/register',
    element: <AuthLayout><RegisterPage /></AuthLayout>,
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <MainLayout title={'Tablero'}><DashboardPage /></MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: '/profile/edit',
    element: (
      <PrivateRoute>
        <MainLayout title={'Perfil'}><EditProfilePage /></MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: '/forms/create',
    element: (
      <PrivateRoute>
        <MainLayout title={'Crear formulario'}><CreateFormPage /></MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: '/forms/viewer',
    element: (
      <PrivateRoute>
        <MainLayout title={'Mis formularios'}><ViewFormPage /></MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: '/forms/edit',
    element: (
      <PrivateRoute>
        <MainLayout title={'Editar formulario'}><EditFormPage /></MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: '/forms/responses',
    element: (
      <PrivateRoute>
        <MainLayout title={'Respuestas'}><FormResponsePage /></MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: '/public/form',
    element: (
      <PublicFormQuestionPage />
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export default routes;
