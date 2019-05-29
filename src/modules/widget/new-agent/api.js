import config_server from '@/config/config'
const api = config_server.server_api;

import { httpAgent } from '@/config/utils';


export const createAgent = (agent,successCb,erroCb) => {
    const url = api + '/users/brokers.json';
    let param = {
        nickname:agent.nickname,
        shareRatio:agent.shareRatio,
        taxRatio:agent.taxRatio,
        status:agent.status,
        orgId:agent.unionId,
    }
    httpAgent(url, 'POST', param, successCb,erroCb);

}

export const modifyAgent = (agent,successCb,erroCb) => {
    const url = api + '/users/brokers/'+agent.uuid+'.json';
    let param = {
        nickname:agent.nickname,
        shareRatio:agent.shareRatio,
        taxRatio:agent.taxRatio,
        status:agent.status,
        orgId:agent.unionId,
    }

    httpAgent(url, 'PUT', param, successCb,erroCb);
}



