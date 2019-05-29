import * as types from '../mutation-types'

// initial state
const state = {
	flowList:[],//账号组
	total:0,
	currentPage:1,
	limit:20,
}

// getters
const getters = {
	flowList: state => state.flowList,
	total: state => state.total,
	currentPage: state => state.currentPage,
	limit: state => state.limit,

}

// actions
const actions = {
	getFlowList ({commit, state,dispatch},{currentPage,limit,filter}){
		const start = (currentPage-1)*limit;
		return new Promise((resolve,reject)=>{
			$API.finance.getFlowList({start,limit,filter},resp => {
    			commit(types.INIT_FLOW_LIST,{resp,currentPage,limit})
				resolve(resp);
			})
	    })
	},

	


}



// mutations
const mutations = {
	[types.INIT_FLOW_LIST] (state,{resp,currentPage,limit}) {
		state.currentPage = currentPage;
		state.limit = limit;
	    state.flowList = resp.list;
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

