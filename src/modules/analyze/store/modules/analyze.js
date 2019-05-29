import * as types from '../mutation-types'

// initial state
const state = {
}

// getters
const getters = {

}

// actions
const actions = {
	getAnalyzeList ({commit, state,dispatch},{currentPage,limit,filter}){
		const start = (currentPage-1)*limit;
		return new Promise((resolve,reject)=>{
			$API.analyze.getAnalyzeList({start,limit,filter},resp => {
				resolve(resp);
			})
	    })
	},

	


}



// mutations
const mutations = {

}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}

