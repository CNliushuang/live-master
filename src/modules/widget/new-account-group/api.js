import config_server from '@/config/config'
const api = config_server.server_api;

import { httpAgent } from '@/config/utils';


export const createAuthorityGroup = (authorityGroup,successCb,erroCb) => {
    const url = api + '/authority_group.json';
    let param = {
    	name:authorityGroup.name,
    	orgType:authorityGroup.orgType,
    	status:authorityGroup.status,
    }
    let authorities = [];
    if(authorityGroup.authorities){
        for(var items of authorityGroup.authorities){
            var temp = {
                uuid:items.uuid,
                readStatus:items.readStatus,
                writeStatus:items.writeStatus
            }
            authorities.push(temp);
        }
    }
    param.authorities = authorities;

    httpAgent(url, 'POST', param, successCb,erroCb);

}

export const modifyAuthorityGroup = (authorityGroup,successCb,erroCb) => {
    const url = api + '/authority_group/'+authorityGroup.uuid+'.json';
    let param = {
    	name:authorityGroup.name,
    	orgType:authorityGroup.orgType,
    	status:authorityGroup.status,
    }

    let authorities = [];
    if(authorityGroup.authorities){
        for(var items of authorityGroup.authorities){
            var temp = {
                uuid:items.uuid,
                readStatus:items.readStatus,
                writeStatus:items.writeStatus
            }
            authorities.push(temp);
        }
    }
    param.authorities = authorities;

    httpAgent(url, 'PUT', param, successCb,erroCb);
}



