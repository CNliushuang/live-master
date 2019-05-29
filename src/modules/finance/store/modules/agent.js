import * as types from '../mutation-types'

// initial state
const state = {
	agentList:[],//
	total:0,
	currentPage:1,
	limit:20,
}

// getters
const getters = {
	agentList: state => state.agentList,
	total: state => state.total,
	currentPage: state => state.currentPage,
	limit: state => state.limit,

}

// actions
const actions = {
	getAgentList ({commit, state,dispatch},{currentPage,limit,filter}){
		const start = (currentPage-1)*limit;
		return new Promise((resolve,reject)=>{
			$API.finance.getAgentList({start,limit,filter},resp => {
    			commit(types.INIT_AGENT_LIST,{resp,currentPage,limit})
				resolve(resp);
			})
	    })
	},
	agreeApply ({commit, state,dispatch},{list}){
		return new Promise((resolve,reject)=>{
			$API.finance.agreeAgentApply({list},resp => {
				resolve(resp);
			})
	    })
	},
	rejectApply ({commit, state,dispatch},{list}){
		return new Promise((resolve,reject)=>{
			$API.finance.rejectAgentApply({list},resp => {
				resolve(resp);
			})
	    })
	},


}



// mutations
const mutations = {
	[types.INIT_AGENT_LIST] (state,{resp,currentPage,limit}) {
		state.currentPage = currentPage;
		state.limit = limit;
	    state.agentList = resp.list;
	    state.total = resp.count;
	},


}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}

