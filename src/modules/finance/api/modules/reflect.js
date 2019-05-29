import { httpAgent } from '@/config/utils'
import qs from 'qs'

export default {
  getReflectList({start,limit,filter}, successCb, erroCb){
    let url = `${config_server.server_api}/finance/cash/apply.json`;
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

      if(filter.status){
        params.status = filter.status;
      }

      if(filter.nickname){
        params.nickname = filter.nickname;
      }

      if(filter.thirdId){
        params.thirdId = filter.thirdId;
      }
      if(filter.date){
        params.startDate = new Date(filter.date[0]).getTime();
        params.endDate = new Date(filter.date[1]).getTime();
      }
      
    }
    


    httpAgent(url,'GET', params,successCb,erroCb)
  },
  agreeApply({list},successCb, erroCb){
    let url = `${config_server.server_api}/finance/cash/apply/pass.json?`;
    let params = {
    };
    for(var items of list){
      url = url + 'uuid='+items;
    }
    // console.log(params);
    httpAgent(url,'POST', params,successCb,erroCb)
  },
  rejectApply({list},successCb, erroCb){
    let url = `${config_server.server_api}/finance/cash/apply/reject.json?`;
    let params = {
    };
    for(var items of list){
      url = url + 'uuid='+items;
    }
    // console.log(params);
    httpAgent(url,'POST', params,successCb,erroCb)
  },


}
