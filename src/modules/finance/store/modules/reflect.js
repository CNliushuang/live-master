import * as types from '../mutation-types'

// initial state
const state = {
	reflectList:[],//
	total:0,
	currentPage:1,
	limit:20,
}

// getters
const getters = {
	reflectList: state => state.reflectList,
	total: state => state.total,
	currentPage: state => state.currentPage,
	limit: state => state.limit,

}

// actions
const actions = {
	getReflectList ({commit, state,dispatch},{currentPage,limit,filter}){
		const start = (currentPage-1)*limit;
		return new Promise((resolve,reject)=>{
			$API.finance.getReflectList({start,limit,filter},resp => {
    			commit(types.INIT_REFLECT_LIST,{resp,currentPage,limit})
				resolve(resp);
			})
	    })
	},
	agreeApply ({commit, state,dispatch},{list}){
		return new Promise((resolve,reject)=>{
			$API.finance.agreeApply({list},resp => {
				resolve(resp);
			})
	    })
	},
	rejectApply ({commit, state,dispatch},{list}){
		return new Promise((resolve,reject)=>{
			$API.finance.rejectApply({list},resp => {
				resolve(resp);
			})
	    })
	},


}



// mutations
const mutations = {
	[types.INIT_REFLECT_LIST] (state,{resp,currentPage,limit}) {
		state.currentPage = currentPage;
		state.limit = limit;
	    state.reflectList = resp.list;
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

