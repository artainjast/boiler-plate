import { AxiosRequestConfig, AxiosResponse } from 'axios';
import baseClient from './index';
import { CustomAxiosRequestConfig } from './types';

// Extended options interface for Orval mutator
interface MutatorOptions {
  signal?: AbortSignal;
  extraConfig?: {
    hasToken?: boolean;
    handlers?: object;
    isNormalize?: boolean; // Add option to control camelCase transformation
  };
}

// Mutator function for Orval with support for custom extraConfig
export const mutator = <T = any>(
  config: AxiosRequestConfig, 
  options?: MutatorOptions
): Promise<AxiosResponse<T>> => {
  const requestConfig = {
    ...config,
    extraConfig: options?.extraConfig,
  } as CustomAxiosRequestConfig;

  // Add signal if provided
  if (options?.signal) {
    requestConfig.signal = options.signal;
  }
  
  return baseClient(requestConfig);
};

// Keep default export for backward compatibility
export default mutator; 