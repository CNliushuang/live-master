import config_server from '@/config/config'
const api = config_server.server_api;
const proxy = config_server.server_user;
import { httpAgent } from '@/config/utils';


export const projectImportStatus = ({ groupId }, cb) => {
    const url = api+'/plat/flow/import/result.json';
    const param = {
    	optId:groupId
    };
    httpAgent(url, 'GET', param, cb);

}

export const projectImportResult = ({ groupId }, cb) => {
    const url = api+'/project/import/'+groupId+'.json';
    const param = {
    };
    httpAgent(url, 'GET', param, cb);
}
