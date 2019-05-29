import { httpAgent } from '@/config/utils'
import qs from 'qs'

export default {
  getAccountList({start,limit,filter,sorters}, successCb, erroCb){
    let url = `${config_server.server_api}/plat/flow.json?`;

    if(sorters && sorters.length > 0){
      url = url + '&sorters='+encodeURIComponent(JSON.stringify(sorters));
    }


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
  deleteAccount({list},successCb, erroCb){
    let url = `${config_server.server_api}/plat/flow.json?`;
    let params = {};
    for(var items of list){
      url = url + '&uuid='+items;
    }
    // console.log(params);
    httpAgent(url,'DELETE', params,successCb,erroCb)
  },
  calculateAccount({list},successCb, erroCb){
    let url = `${config_server.server_api}/plat/flow/calculate.json`;
    let params = '';
    for(var items of list){
      params = params + '&uuid='+items;
    }
    // console.log(params);
    httpAgent(url,'POST', params,successCb,erroCb)
  },
  autoCalculate({},successCb, erroCb){
    let url = `${config_server.server_api}/plat/flow/calculate/auto.json`;
    let params = {};

    // console.log(params);
    httpAgent(url,'POST', params,successCb,erroCb)
  },





}
