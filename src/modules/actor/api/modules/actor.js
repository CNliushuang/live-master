import { httpAgent } from '@/config/utils'
import qs from 'qs'

export default {
  getActorList({start,limit,filter}, successCb, erroCb){
    let url = `${config_server.server_api}/users/actors.json`;
    let params = {
      start,
      limit
    }
    if(filter){
      if(filter.distributeStatus || filter.distributeStatus == 0){
        params.distributeStatus = filter.distributeStatus
      }
      if(filter.status || filter.status == 0){
        params.status = filter.status
      }
      if(filter.brokerId || filter.brokerId == ''){
        params.brokerId = filter.brokerId
      }
      if(filter.thirdId){
        params.thirdId = filter.thirdId
      }
      if(filter.unionId){
        params.orgId = filter.unionId
      }else{
        if(filter.platId){
          params.orgId = filter.platId;
        }
      }
    }
    httpAgent(url,'GET', params,successCb,erroCb)
  },
  deleteActor({list},successCb, erroCb){
    let url = `${config_server.server_api}/users/actors.json`;
    let params = '';
    for(var items of list){
      params = params + '&uuid='+items;
    }
    // console.log(params);
    httpAgent(url,'DELETE', params,successCb,erroCb)
  },
  assignActor({orgId,list},successCb, erroCb){
    let url = `${config_server.server_api}/users/actors/distribute.json`;
    let params = 'orgId='+orgId;
    for(var items of list){
      params = params + '&actorId='+items;
    }
    // console.log(params);
    httpAgent(url,'POST', params,successCb,erroCb)
  },












}
