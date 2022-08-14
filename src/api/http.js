import axios from  'axios';
import router from "../router";

axios.defaults.timeout=5000;//超时时间为5秒
axios.defaults.withCredentials=true;//允许跨域
//Content-type响应头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
// x-www-form-urlencoded
//基础uri
axios.defaults.baseURL="http://localhost:8888"

//响应拦截器
axios.interceptors.response.use(
  response =>{
    if(response.status ==200){
      return Promise.resolve(response);//正确让程序继续执行
    }else{
      return Promise.reject(response);
    }
  },
  error => {
    if(error.response.status){
      switch (error.response.status){
        case 401:
          router.replace(
            {
              path:'/',
              query:{
                redirect:router.currentRoute.fullPath  //存下当前地址
              }
            }
          );
          break;
        case 404://没找到
          break;
      }
      return Promise.reject(error.response);
    }
  }
)

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function get(url, params={}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {params:params}).then(
      response => resolve(response.data),
      error => reject(error)
    )
  });
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data).then(
      response => resolve(response.data),
      error => reject(error)
    );
  });
}
