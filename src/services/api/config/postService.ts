import { mapKeysDeep } from '@/utils/transformer/mapKeysDeep';
import baseClient from '.';
import { CustomAxiosResponse, RequestInputType } from './types';

export const postService = async <InputType, ReturnType>({
  url,
  configs,
  customs = {
    isNormalize: true,
  },
  data,
}: RequestInputType<InputType>) => {
  if (customs?.isNormalize) {
    const response = await baseClient.post<ReturnType, CustomAxiosResponse<ReturnType>>(
      url,
      data,
      {
        ...configs,
        params: configs?.params || {},
      },
    );

    return {
      type: response.type,
      data: mapKeysDeep(response.data) as ReturnType,
      status: response.status,
    };
  }
  return await baseClient.post<ReturnType, CustomAxiosResponse<ReturnType>>(
    url,
    data,
    configs,
  );
};
