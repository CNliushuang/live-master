import * as types from '../mutation-types'

// initial state
const state = {
	salaryList:[],//账号组
	total:0,
	currentPage:1,
	limit:20,
}

// getters
const getters = {
	salaryList: state => state.salaryList,
	total: state => state.total,
	currentPage: state => state.currentPage,
	limit: state => state.limit,

}

// actions
const actions = {
	getActorSalaryList ({commit, state,dispatch},{currentPage,limit,filter}){
		const start = (currentPage-1)*limit;
		return new Promise((resolve,reject)=>{
			$API.finance.getActorSalaryList({start,limit,filter},resp => {
    			commit(types.INIT_ACTOR_SALARY_LIST,{resp,currentPage,limit})
				resolve(resp);
			})
	    })
	},
	agreeApply ({commit, state,dispatch},{list}){
		return new Promise((resolve,reject)=>{
			$API.finance.agreeActorApply({list},resp => {
				resolve(resp);
			})
	    })
	},
	rejectApply ({commit, state,dispatch},{list}){
		return new Promise((resolve,reject)=>{
			$API.finance.rejectActorApply({list},resp => {
				resolve(resp);
			})
	    })
	},
	


}



// mutations
const mutations = {
	[types.INIT_ACTOR_SALARY_LIST] (state,{resp,currentPage,limit}) {
		state.currentPage = currentPage;
		state.limit = limit;
	    state.salaryList = resp.list;
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

