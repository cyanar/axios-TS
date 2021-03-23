import axios,{AxiosResponse} from './axios';
const baseUrl = 'http://localhost:8080';
interface User {
  name: string,
  password: number
}
let user:User = {
  name: 'gg',
  password: 123456
}
axios({
  method: 'get',
  url: baseUrl + '/get',
  params: user
}).then((response:AxiosResponse)=>{
  console.log(response,'response');
  return response.data;
}).catch((error:any)=>{
  console.log(error);
});
