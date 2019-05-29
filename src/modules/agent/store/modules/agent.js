import * as types from '../mutation-types'

// initial state
const state = {
	agentList:[],//账号组
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
			$API.agent.getAgentList({start,limit,filter},resp => {
    			commit(types.INIT_AGENT_LIST,{resp,currentPage,limit})
				resolve(resp);
			})
	    })
	},
	deleteAgent ({commit, state,dispatch},{uuid}){
		return new Promise((resolve,reject)=>{
			$API.agent.deleteAgent({uuid},resp => {
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

