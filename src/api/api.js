import {get,post} from '../utils/request'
import { APP_ID, APP_SECRET } from '../utils/const'

const base_url ='https://test.youbaobao.xyz:18081'

export function getHomeData(params){
     return get(`${base_url}/book/home/v2`,params)
}

export function recommend() {
     return get(`${base_url}/book/home/recommend/v2`)
   }
   
   export function getOpenId(code) {
     return get(`${base_url}/openId/get`, {
       appId: APP_ID,
       secret: APP_SECRET,
       code
     })
   }
   export function register(params) {
    return post(`${base_url}/user/register`,params)
  }

  export function hotSearch() {
    return get(`${base_url}/book/hot-search`)
  }

  export function search(params) {
    if (params.keyword) {
      params.keyword = encodeURIComponent(params.keyword)
    }
    // if (!params.pageSize) {
    //   params.pageSize = 20
    // }
    // if (!params.page) {
    //   params.page = 1
    // }
    return get(`${base_url}/book/search`, params)
  }
  
   