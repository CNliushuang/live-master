import * as types from '../mutation-types'

// initial state
const state = {
	logs:[],//
	total:0,
	currentPage:1,
	limit:20,
	logs_types:[],
	logs_maps:{}
}

// getters
const getters = {
	logs: state => state.logs,
	total: state => state.total,
	currentPage: state => state.currentPage,
	limit: state => state.limit,
	logs_types: state => state.logs_types,
	logs_maps: state => state.logs_maps,

}

// actions
const actions = {
	getLogsList ({commit, state,dispatch},{currentPage,limit}){
		const start = (currentPage-1)*limit;
		return new Promise((resolve,reject)=>{
			$API.logs.getLogsList({start,limit},resp => {
    			commit(types.INIT_LOGS_LIST,{resp,currentPage,limit})
				resolve(resp);
			})
	    })
	},
	getLogsTypes({commit, state,dispatch}){
		return new Promise((resolve,reject)=>{
			$API.logs.getLogsTypes({},resp => {
    			commit(types.INIT_LOGS_TYPES,{resp})
				resolve(resp);
			})
	    })
	}

}



// mutations
const mutations = {
	[types.INIT_LOGS_LIST] (state,{resp,currentPage,limit}) {
		state.currentPage = currentPage;
		state.limit = limit;
	    state.logs = resp.list;
	    state.total = resp.count;
	},
	[types.INIT_LOGS_TYPES] (state,{resp}) {
		state.logs_types = resp.list;
		let maps = {}
		for(var items of resp.list){
			maps[items.value] = items.name;
		}
		state.logs_maps = maps;
	},




}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}

