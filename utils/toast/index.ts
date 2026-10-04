import { ToastProps } from './Toast';
import { store } from './toast-store';

export const toast = Object.assign(
  (title: string, options?: Partial<ToastProps>) => store.create({ ...options, title, variant: 'info' }),
  {
    info: (title: string, options?: Partial<ToastProps>) => store.create({ ...options, title, variant: 'info' }),
    success: (title: string, options?: Partial<ToastProps>) => store.create({ ...options, title, variant: 'success' }),
    error: (title: string, options?: Partial<ToastProps>) => store.create({ ...options, title, variant: 'error' }),
  },
);
