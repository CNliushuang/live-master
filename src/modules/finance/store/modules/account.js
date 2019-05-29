import * as types from '../mutation-types'

// initial state
const state = {
	accountList:[],//入账管理流水
	total:0,
	currentPage:1,
	limit:20,
	analyze:{}
}

// getters
const getters = {
	accountList: state => state.accountList,
	total: state => state.total,
	currentPage: state => state.currentPage,
	limit: state => state.limit,
	analyze: state => state.analyze,

}

// actions
const actions = {
	getAccountList ({commit, state,dispatch},{currentPage,limit,filter,sorters}){
		const start = (currentPage-1)*limit;
		return new Promise((resolve,reject)=>{
			$API.finance.getAccountList({start,limit,filter,sorters},resp => {
    			commit(types.INIT_ACCOUNT_LIST,{resp,currentPage,limit})
				resolve(resp);
			})
	    })
	},
	deleteAccount ({commit, state,dispatch},{list}){
		return new Promise((resolve,reject)=>{
			$API.finance.deleteAccount({list},resp => {
				resolve(resp);
			})
	    })
	},
	calculateAccount ({commit, state,dispatch},{list}){
		return new Promise((resolve,reject)=>{
			$API.finance.calculateAccount({list},resp => {
				resolve(resp);
			})
	    })
	},
	autoCalculate ({commit, state,dispatch}){
		return new Promise((resolve,reject)=>{
			$API.finance.autoCalculate({},resp => {
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
	    /*设置统计信息*/
	    state.analyze = resp;

	},


}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}

