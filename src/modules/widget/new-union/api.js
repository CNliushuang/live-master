import config_server from '@/config/config'
const api = config_server.server_api;

import { httpAgent } from '@/config/utils';


export const createUnion = (union,successCb,erroCb) => {
    const url = api + '/org.json';
    let param = {
        name:union.name,
        shareRatio:union.shareRatio,
        taxRatio:union.taxRatio,
        status:union.status,
        orgType:union.orgType,
        parentId:union.parentId,
        autoPay:union.autoPay,
    }
    if(union.autoPayDate){
        param.autoPayDate = new Date(union.autoPayDate).getTime();
    }

    if(union.admin){
        var list = [];
        list.push({uuid:union.admin})
        param.admins = list;
    }
    
    httpAgent(url, 'POST', param, successCb,erroCb);

}

export const modifyUnion = (union,successCb,erroCb) => {
    const url = api + '/org/'+union.uuid+'.json';
    let param = {
        name:union.name,
        shareRatio:union.shareRatio,
        taxRatio:union.taxRatio,
        status:union.status,
        orgType:union.orgType,
        parentId:union.parentId,
        preSetAutoPay:union.autoPay
    }
    if(union.autoPayDate){
        param.autoPayDate = new Date(union.autoPayDate).getTime();
    }
    httpAgent(url, 'PUT', param, successCb,erroCb);
}




