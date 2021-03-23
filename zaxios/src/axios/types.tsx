export type Methods = 'get' | 'GET' | 'post' | 'POST' | 'put' | 'PUT' | 'delete' | 'DELETE' | 'OPTIONS';
export interface AxiosRequestConfig{
  url: string,
  method: Methods,
  params: any
}
//axios.prototype.request这个方法
//promise的泛型T代表resolve的值
export interface AxiosInstance{
   <T=any>(config:AxiosRequestConfig): Promise<T>
}

export interface AxiosResponse<T=any>{
  data: T;
  status: number;
  statusText: string;
  headers: Record<string,any>;
  config: AxiosRequestConfig
  request?: XMLHttpRequest
}