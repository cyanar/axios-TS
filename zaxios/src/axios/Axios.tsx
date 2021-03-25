import { AxiosRequestConfig, AxiosResponse } from './types';
import AxiosInterceptorManager, { Interceptor } from './AxiosInterceptorManager';

import qs from 'qs';
import parseHeaders from 'parse-headers';
//合并请求
let defaults:AxiosRequestConfig = {
   method: 'get',
   timeout:0,
   headers:{
     common: { //针对所有的请求生效
       accept: 'application/json'
     }
   },
   transformRequest:(data:any,headers:any) => { //  请求转换
      headers['common']['content-type'] = 'application/json';
      return JSON.stringify(data);
   },
   transformResponse:(response:any) => {
      return response.data;
   }
}
let getStyleMethods = ['get','head','delete','options']; //get风格的请求
getStyleMethods.forEach((method:string)=>{
  defaults.headers![method] = {};
});
let postStyleMethods = ['post','put','patch']; //post风格的请求
postStyleMethods.forEach((method:string)=>{
  defaults.headers![method] = {
    'content-type': 'application/json'
  };
})
let allMethods = [...getStyleMethods,...postStyleMethods];
export default class Axios<T> {
  public defaults:AxiosRequestConfig = defaults;
  public interceptors = {
    request: new AxiosInterceptorManager<AxiosRequestConfig>(),
    response: new AxiosInterceptorManager<AxiosResponse<T>>(),
  };
  request(config: AxiosRequestConfig): Promise<AxiosRequestConfig | AxiosResponse<T>> {
      // return this.dispatchRequest<T>(config);
      config.headers = Object.assign(this.defaults.headers, config.headers);
      if(config.data && config.transformRequest){
        config.data = config.transformRequest(config.data, config.headers)
      }
      const chain: Array<Interceptor<AxiosRequestConfig> | Interceptor<AxiosResponse<T>>> = [
        { onFulfilled: this.dispatchRequest },
      ];
      //添加请求
      this.interceptors.request.interceptors.forEach((interceptor: Interceptor<AxiosRequestConfig> | null) => {
        interceptor && chain.unshift(interceptor);
      });
      //添加响应
      this.interceptors.response.interceptors.forEach((interceptor: Interceptor<AxiosResponse<T>> | null) => {
        interceptor && chain.push(interceptor);
      });
      let promise:any = Promise.resolve(config);
      while(chain.length){
         const { onFulfilled, onRejected} = chain.shift()!;
         promise = promise.then(onFulfilled,onRejected);
      }
      return promise;
  }
  dispatchRequest<T>(config: AxiosRequestConfig): Promise<AxiosRequestConfig | AxiosResponse<T>> {
    return new Promise<AxiosResponse<T>>(function (resolve, reject) {
      console.log(config, 'sss');
      let { method, url, params, data, headers, timeout } = config;
      let request = new XMLHttpRequest();
      if (params) {
        params = qs.stringify(params);
        url += (url!.indexOf('?') === -1 ? '?' : '&') + params;
      }
      request.open(method!, url!, true);
      request.responseType = 'json';
      request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status !== 0) {
          if (request.status >= 200 && request.status < 300) {
            let response: AxiosResponse<T> = {
              data: request.response ? request.response : request.responseText,
              status: request.status,
              statusText: request.statusText,
              //{content-type: 'xxx'}
              headers: parseHeaders(request.getAllResponseHeaders()),
              config,
              request,
            };
            if(config.transformResponse){
              response = config.transformResponse(response);
            }
            resolve(response);
          } else {
            reject(`Error:Request failed with status code ${request.status}`); //状态码错误
          }
        }
      };
      // if (headers) {
      //   for (let key in headers) {
      //     request.setRequestHeader(key, headers[key]);
      //   }
      // }
      if(headers){
         for(let key in headers){
           if(key === 'common' || allMethods.includes(key)){
             if(key === config.method){
                for(let key2 in headers[key]){
                    request.setRequestHeader(key2, headers[key][key2]);
                } 
             }
           }else{
              request.setRequestHeader(key, headers[key]);
           }
         }
      }
      let body: string | null = null;
      if (data) {
        body = JSON.stringify(data);
      }
      request.onerror = function () {
        //网络错误
        reject('net:ERR_INTERNET_DISCONNECTED');
      };
      if (timeout) {
        request.timeout = timeout;
        request.ontimeout = function () {
          //超时错误
          reject(`Error:timeout of ${timeout}ms exceeded`);
        };
      }
      if(config.cancelToken){
         config.cancelToken.then((message:string)=>{
            request.abort();
            reject(message);
         })
      }
      request.send(body);
    });
  }
}
