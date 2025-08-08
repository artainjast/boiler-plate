import { isServer } from '../isServer';

export const setToLocalStorage = (name: string, value: string) => {
  if (!isServer) {
    localStorage.setItem(name, value);
  }
};

export const getFromLocalStorage = (name: string) => {
  if (!isServer) {
    localStorage.getItem(name);
  }
};

export const removeFromLocalStorage = (name: string) => {
  if (!isServer) {
    localStorage.removeItem(name);
  }
};
