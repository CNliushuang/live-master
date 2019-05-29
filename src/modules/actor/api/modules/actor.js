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
      if(filter.distributeStatus || filter.distributeStatus === 0){
        params.distributeStatus = filter.distributeStatus
      }
      if(filter.status || filter.status === 0){
        params.status = filter.status
      }
      if(filter.brokerId || filter.brokerId == ''){
        params.brokerId = filter.brokerId
      }
      if(filter.thirdId){
        params.thirdId = filter.thirdId
      }
      if(filter.id){
        params.id = filter.id
      }
      if(filter.nickname){
        params.nickname = filter.nickname
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
  getApplyList({start,limit,filter}, successCb, erroCb){
    let url = `${config_server.server_api}/user/actor/apply.json`;
    let params = {
      start,
      limit
    }
    if(filter){
      if(filter.identityName){
        params.identityName = filter.identityName
      }
      if(filter.mobile){
        params.mobile = filter.mobile
      }

      if(filter.platId){
        params.platId = filter.platId;
      }

      if(filter.status || filter.status === 0){
        params.status = filter.status;
      }

      if(filter.date){
        params.startDate = new Date(filter.date[0]).getTime();
        params.endDate = new Date(filter.date[1]).getTime();
      }

      
    }
    httpAgent(url,'GET', params,successCb,erroCb)
  },





  deleteActor({list},successCb, erroCb){
    let url = `${config_server.server_api}/users/actors.json`;
    let mems = [];
    for(var items of list){
      mems.push(items);
    }
    // console.log(params);
    httpAgent(url,'DELETE', {uuid:mems,_method:"delete"},successCb,erroCb)
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


  changeApplyStatus({uuid,status},successCb, erroCb){
    let url = `${config_server.server_api}/user/actor/apply/${uuid}/status.json`;
    let params = {
      status
    }
    // console.log(params);
    httpAgent(url,'POST', params,successCb,erroCb)
  },

  deleteApply({list},successCb, erroCb){
    let url = `${config_server.server_api}/user/actor/apply.json?_method=delete`;
    let mems = [];
    for(var items of list){
      url = url + '&uuid='+items;
    }
    // console.log(params);
    httpAgent(url,'DELETE', {},successCb,erroCb)
  },







}
