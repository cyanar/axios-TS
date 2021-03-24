import axios,{AxiosResponse,AxiosRequestConfig} from 'axios';
const baseUrl = 'http://localhost:8080';
interface User {
  name: string,
  password: number
}
let user:User = {
  name: 'gg',
  password: 123456
}
console.time('cost');
axios.interceptors.request.use((config:AxiosRequestConfig):AxiosRequestConfig=>{
  config.headers.name +='1';
  return config;
})
let request = axios.interceptors.request.use((config:AxiosRequestConfig):AxiosRequestConfig=>{
  config.headers.name +='2';
  return config;
})
axios.interceptors.request.use((config:AxiosRequestConfig):AxiosRequestConfig=>{
  config.headers.name +='3';
  return config;
})
axios.interceptors.request.eject(request);
axios.interceptors.response.use((response:AxiosResponse):AxiosResponse=>{
  response.data.name +='1';
  return response;
})
axios.interceptors.response.use((response:AxiosResponse):AxiosResponse=>{
  response.data.name +='2';
  return response;
})
axios.interceptors.response.use((response:AxiosResponse):AxiosResponse=>{
  response.data.name +='3';
  return response;
})
axios({
  method: 'post',
  url: baseUrl + '/post',
  params: user,
  headers: {
    'content-type': 'application/json',
    'name': 'gcc'
  },
  timeout: 1000,
  data: user,
}).then((response:AxiosResponse)=>{
  console.log(response,'response');
  return response.data;
}).catch((error:any)=>{
  console.log(error);
});
