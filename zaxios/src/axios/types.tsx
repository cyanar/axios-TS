import AxiosInterceptorManager from './AxiosInterceptorManager';

export type Methods = 'get' | 'GET' | 'post' | 'POST' | 'put' | 'PUT' | 'delete' | 'DELETE' | 'OPTIONS';
export interface AxiosRequestConfig {
  url?: string;
  method?: Methods;
  params?: any;
  headers?: Record<string, any>;
  data?: Record<string, any>;
  timeout?: number;
  transformRequest?:(data:any,headers:any) => any;
  transformResponse?:(data:any) => any;
  cancelToken?:any
}
//axios.prototype.request这个方法
//promise的泛型T代表resolve的值
export interface AxiosInstance {
  <T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  interceptors:{
    request: AxiosInterceptorManager<AxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse>;
  }
  cancelToken: any;
  isCancel:any
}


export interface AxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, any>;
  config: AxiosRequestConfig;
  request?: XMLHttpRequest;
}
