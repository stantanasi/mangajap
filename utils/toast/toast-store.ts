import { ToastProps } from './Toast';

type Subscriber = (options: ToastProps) => void;

class ToastStore {

  private subscribers = new Set<Subscriber>();

  subscribe = (callback: Subscriber) => {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  };

  create(options: Omit<ToastProps, 'id'> & Partial<Pick<ToastProps, 'id'>>) {
    const id = options.id ?? Math.random().toString(36).substring(2, 9);

    this.subscribers.forEach((callback) =>
      callback({
        ...options,
        id: id,
      })
    );
  }
}

export const store = new ToastStore();