import { httpAgent } from '@/config/utils'
import qs from 'qs'

export default {
  getLogsList({start,limit}, successCb, erroCb){
    let url = `${config_server.server_api}/logs.json`;
    let params = {
      start,
      limit,
    }
    httpAgent(url,'GET', params,successCb,erroCb)
  },
  getLogsTypes({}, successCb, erroCb){
    let url = `${config_server.server_api}/logs/types.json`;
    let params = {
    }
    httpAgent(url,'GET', params,successCb,erroCb)
  },





}
