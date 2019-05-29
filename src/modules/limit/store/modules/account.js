import * as types from '../mutation-types'

// initial state
const state = {
	accountList:[],//账号组
	total:0,
	currentPage:1,
	limit:10,
}

// getters
const getters = {
	accountList: state => state.accountList,
	total: state => state.total,
	currentPage: state => state.currentPage,
	limit: state => state.limit,

}

// actions
const actions = {
	getAccountList ({commit, state,dispatch},{currentPage,limit,filter}){
		const start = (currentPage-1)*limit;
		return new Promise((resolve,reject)=>{
			$API.limit.getAccountList({start,limit,filter},resp => {
    			commit(types.INIT_ACCOUNT_LIST,{resp,currentPage,limit})
				resolve(resp);
			})
	    })
	},
	deleteAccount ({commit, state,dispatch},{uuid}){
		return new Promise((resolve,reject)=>{
			$API.limit.deleteAccount({uuid},resp => {
				resolve(resp);
			})
	    })
	},

	


}



// mutations
const mutations = {
	[types.INIT_ACCOUNT_LIST] (state,{resp,currentPage,limit}) {
		state.currentPage = currentPage;
		state.limit = limit;
	    state.accountList = resp.list;
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

