import { mapKeysDeep } from '@/utils/transformer/mapKeysDeep';
import baseClient from '.';
import { CustomAxiosResponse, RequestInputType } from './types';

export const deleteService = async <InputType, ReturnType>({
  url,
  configs,
  customs = {
    isNormalize: true,
  },
  data,
}: RequestInputType<InputType>) => {
  //NOTE: because we don't have a same interface for response data , we normlize it but we have option to don't.
  if (customs?.isNormalize) {
    const response = await baseClient.delete<ReturnType, CustomAxiosResponse<ReturnType>>(
      url,
      {
        ...configs,
        params: data,
      },
    );

    return {
      type: response?.type,
      data: mapKeysDeep(response.data) as ReturnType,
      status: response.status,
    };
  }
  return await baseClient.delete<ReturnType, CustomAxiosResponse<ReturnType>>(url, {
    ...configs,
    params: data,
  });
};
