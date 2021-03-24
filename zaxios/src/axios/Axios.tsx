import { AxiosRequestConfig, AxiosResponse } from './types';
import qs from 'qs';
import parseHeaders from 'parse-headers';
export default class Axios {
  request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.dispatchRequest<T>(config);
  }
  dispatchRequest<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return new Promise<AxiosResponse<T>>(function (resolve, reject) {
      console.log(config, 'sss');
      let { method, url, params, data, headers,timeout } = config;
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
            resolve(response);
          } else {
            reject(`Error:Request failed with status code ${request.status}`); //状态码错误
          }
        }
      };
      if (headers) {
        for (let key in headers) {
          request.setRequestHeader(key, headers[key]);
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
      if(timeout){
        request.timeout = timeout;
        request.ontimeout = function(){//超时错误
            reject(`Error:timeout of ${timeout}ms exceeded`);
        }
      }
      request.send(body);
    });
  }
}
