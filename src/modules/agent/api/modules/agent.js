import { httpAgent } from '@/config/utils'
import qs from 'qs'

export default {
  getAgentList({start,limit,filter}, successCb, erroCb){
    let url = `${config_server.server_api}/users/brokers.json`;
    let params = {
      start,
      limit
    }
    if(filter){
      if(filter.unionId){
        params.orgId = filter.unionId;
      }else{
        if(filter.platId){
          params.orgId = filter.platId
        }
      }

      if(filter.status || filter.status == 0){
        params.status = filter.status;
      }

      if(filter.nickname){
        params.nickname = filter.nickname;
      }

      if(filter.id){
        params.id = filter.id;
      }
    }
    


    httpAgent(url,'GET', params,successCb,erroCb)
  },
  deleteAgent({uuid},successCb, erroCb){
    let url = `${config_server.server_api}/users/brokers/${uuid}.json`;
    let params = {
    }
    httpAgent(url,'DELETE', params,successCb,erroCb)
  },



}
