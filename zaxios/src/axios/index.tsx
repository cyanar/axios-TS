import Axios from './Axios';
import { AxiosInstance } from './types';
import {CancelToken,isCancel} from './cancel';
//可以创建一个axios的实例，axios其实是一个函数
function createInstance():AxiosInstance{
  let context:Axios<any> = new Axios();
  let instance = Axios.prototype.request.bind(context);
  instance = Object.assign(instance,Axios.prototype,context);
  return instance as AxiosInstance;
}
let axios = createInstance();
axios.cancelToken = new CancelToken();
axios.isCancel = isCancel;
export default axios;

export * from './types';