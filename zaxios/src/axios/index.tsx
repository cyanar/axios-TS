import Axios from './Axios';
import { AxiosInstance } from './types';
//可以创建一个axios的实例，axios其实是一个函数
function createInstance():AxiosInstance{
  let context:Axios = new Axios();
  let instance = Axios.prototype.request.bind(context);
  instance = Object.assign(instance,Axios.prototype,context);
  return instance as AxiosInstance;
}
let axios = createInstance();
export default axios;

export * from './types';