import { httpAgent } from '@/config/utils'
import qs from 'qs'

export default {
  getAccountGroup( {start,limit} ,successCb, erroCb){
    let url = `${config_server.server_api}/authority_group.json`;
    let params = {
      start,
      limit
    }
    httpAgent(url,'GET', params,successCb,erroCb)
  },
  getAuthoritiesList(successCb, erroCb){
    let url = `${config_server.server_api}/authorities.json`;
    let params = {
    }
    httpAgent(url,'GET', params,successCb,erroCb)
  },
  getAccountGroupDetail({uuid},successCb, erroCb){
    let url = `${config_server.server_api}/authority_group/${uuid}.json`;
    let params = {
    }
    httpAgent(url,'GET', params,successCb,erroCb)
  },
  deleteAccountGroup({uuid},successCb, erroCb){
    let url = `${config_server.server_api}/authority_group/${uuid}.json`;
    let params = {
      _method:"delete"
    }
    httpAgent(url,'DELETE', params,successCb,erroCb)
  },


}
