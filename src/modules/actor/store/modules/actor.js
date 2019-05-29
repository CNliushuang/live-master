import * as types from '../mutation-types'

// initial state
const state = {
	platFromList:[],//平台列表
	groupList:[],//工会列表
	agentList:[],//经纪人列表
	actorList:[],//艺人列表
}

// getters
const getters = {
	platFromList: state => state.platFromList,
	groupList: state => state.groupList,
	agentList: state => state.agentList,
	actorList: state => state.actorList,

}

// actions
const actions = {
	getActorList ({commit, state,dispatch},{currentPage,limit,filter}){
		const start = (currentPage-1)*limit;
		return new Promise((resolve,reject)=>{
			$API.actor.getActorList({start,limit,filter},resp => {
				resolve(resp);
			})
	    })
	},
	deleteActor ({commit, state,dispatch},{list}){
		return new Promise((resolve,reject)=>{
			$API.actor.deleteActor({list},resp => {
				resolve(resp);
			})
	    })
	},
	assignActor ({commit, state,dispatch},{orgId,list}){
		return new Promise((resolve,reject)=>{
			$API.actor.assignActor({orgId,list},resp => {
				resolve(resp);
			})
	    })
	},
	getApplyList ({commit, state,dispatch},{currentPage,limit,filter}){
		const start = (currentPage-1)*limit;
		return new Promise((resolve,reject)=>{
			$API.actor.getApplyList({start,limit,filter},resp => {
				resolve(resp);
			})
	    })
	},
	changeApplyStatus ({commit, state,dispatch},{uuid,status}){
		return new Promise((resolve,reject)=>{
			$API.actor.changeApplyStatus({uuid,status},resp => {
				resolve(resp);
			})
	    })
	},
	deleteApply ({commit, state,dispatch},{list}){
		return new Promise((resolve,reject)=>{
			$API.actor.deleteApply({list},resp => {
				resolve(resp);
			})
	    })
	},



}



// mutations
const mutations = {
	[types.INIT_PLATFROM_LIST] (state,list) {
	    state.platFromList = list;
	},
	[types.INIT_GROUP_LIST] (state,list) {
	    state.groupList = list;
	},
	[types.INIT_AGENT_LIST] (state,list) {
	    state.agentList = list;
	},
	[types.INIT_ACTOR_LIST] (state,list) {
	    state.actorList = list;
	},
	


}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}

