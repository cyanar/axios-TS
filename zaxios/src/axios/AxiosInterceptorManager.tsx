
interface OnFulfilled<V>{
  (value: V) : V | Promise<V>
}
interface OnRejected {
  (error: any) :  any
}
export interface Interceptor<V>{
  onFulfilled? :OnFulfilled<V> //成功的回调
  onRejected?: OnRejected
}
export default class InterceptorManager<V > {
  public interceptors:Array<Interceptor<V> | null> = []
  //每当调用use的时候可以向拦截器管理器中添加一个拦截器
  use(onFulfilled?: OnFulfilled<V>, onRejected?: OnRejected):number{
      this.interceptors.push({
        onFulfilled,
        onRejected
      })
      return this.interceptors.length - 1;
  }
  eject(id:number){
     if(this.interceptors[id]){
        this.interceptors[id] = null;
     }
  }
}