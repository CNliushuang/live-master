import config_server from '@/config/config'
const api = config_server.server_api;

import { httpAgent } from '@/config/utils';


export const changeKfInfo = ({key,value},successCb,erroCb) => {
    const url = api + '/plat/setting.json';
    let param = {
        key:key,
        value:value,
    }
    httpAgent(url, 'POST', param, successCb,erroCb);
}

export const getKfInfo = ({key},successCb,erroCb) => {
    const url = api + '/plat/setting.json';
    let param = {
        key:key,
    }
    httpAgent(url, 'GET', param, successCb,erroCb);
}

