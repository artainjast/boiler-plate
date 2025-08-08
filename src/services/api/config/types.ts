// types.ts
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
//   extraConfig?: {
//     hasToken?: boolean;
//     handlers?: object;
//   };
// }

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  extraConfig?: {
    hasToken?: boolean;
    handlers?: object;
    isNormalize?: boolean; // Add option to control camelCase transformation
  };
}
export interface CustomAxiosResponse<T = any> extends AxiosResponse<T> {
  type: 'success' | 'error';
  apiDetail: any;
}

export interface RequestInputType<T> {
  url: string;
  configs?: Partial<CustomAxiosRequestConfig>;
  data?: T | undefined;
  customs?: {
    isNormalize?: boolean;
  };
}
