import { httpAgent } from '@/config/utils'
import qs from 'qs'

export default {
  getAnalyzeList({start,limit,filter}, successCb, erroCb){
    let url = `${config_server.server_api}/analyze/user/actor/day.json`;
    let params = {
      start,
      limit
    }
    if(filter){
      // if(filter.orgId){
      //   params.orgId = filter.orgId;
      // }
      if(filter.unionId){
        params.orgId = filter.unionId;
      }else{
        if(filter.platId){
          params.orgId = filter.platId
        }
      }

      if(filter.date){
        params.startDate = new Date(filter.date[0]).getTime();
        params.endDate = new Date(filter.date[1]).getTime();
      }
      
    }

    httpAgent(url,'GET', params,successCb,erroCb)
  },

}
