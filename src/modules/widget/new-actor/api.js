import config_server from '@/config/config'
const api = config_server.server_api;

import { httpAgent } from '@/config/utils';

export const modifyActor = (actor,successCb,erroCb) => {
    const url = api + '/users/actors/'+actor.uuid+'.json';
    let param = {
        
    }
    if(actor.orgId){
        param.orgId = actor.orgId
    }
    if(actor.brokerId){
        param.brokerId = actor.brokerId
    }else{
        param.brokerId = ''

    }
    if(actor.nickname){
        param.nickname = actor.nickname
    }

    if(actor.identityName){
        param.identityName = actor.identityName
    }
    if(actor.identityCardId){
        param.identityCardId = actor.identityCardId
    }
    if(actor.mobile){
        param.mobile = actor.mobile
    }
    if(actor.qqId){
        param.qqId = actor.qqId
    }
    if(actor.wechatId){
        param.wechatId = actor.wechatId
    }
    if(actor.payFloor){
        param.payFloor = actor.payFloor
    }

    if(actor.validDay){
        param.validDay = actor.validDay
    }
    if(actor.validDayHour){
        param.validDayHour = actor.validDayHour
    }
    if(actor.validHour){
        param.validHour = actor.validHour
    }

    if(actor.status || actor.status == 0){
        param.status = actor.status
    }

    if(actor.shareRatio){
        param.shareRatio = actor.shareRatio
    }
    if(actor.shareType || actor.shareType == 0){
        param.shareType = actor.shareType
    }
    if(actor.taxRatio){
        param.taxRatio = actor.taxRatio
    }
    if(actor.shareProperties){
        param.shareProperties = actor.shareProperties
    }

    httpAgent(url, 'PUT', param, successCb,erroCb);
}

export const modifyCashAccount = ({uuid,account},successCb,erroCb) => {
    const url = api + '/user/cash/account/'+uuid+'.json';
    let param = {
        
    }
    if(account.bcName){
        param.bcName = account.bcName
    }
    if(account.bcCity){
        param.bcCity = account.bcCity
    }
    if(account.bcBranch){
        param.bcBranch = account.bcBranch
    }
    if(account.accountNum){
        param.accountNum = account.accountNum
    }




    httpAgent(url, 'PUT', param, successCb,erroCb);
}













