import { httpAgent } from '@/config/utils'
import qs from 'qs'

export default {
  /**
   * 登录接口
   * @param identify
   * @param password
   * @param successCb
   * @param erroCb
   */
  getPlatFormList({orgId,status,searchKey,start,limit}, successCb, erroCb){
    let url = `${config_server.server_api}/org.json`;
    let params = {
      orgId,
      orgType:"PLAT",
      start,
      limit,
    }
    if(status){
      params.status = status;
    }
    if(searchKey){
      params.searchKey = searchKey;
    }

    httpAgent(url,'GET', params,successCb,erroCb)
  },

  deletePlat({uuid},successCb, erroCb){
    let url = `${config_server.server_api}/org/${uuid}.json`;
    let params = {
    }
    httpAgent(url,'DELETE', params,successCb,erroCb)
  },











}
