import * as types from '../mutation-types'

// initial state
const state = {
	user: null,
	authorities:[],
	system:null,
	platInfo:null,
	unionInfo:null,
	banner:"",
	color:""
}

// getters
const getters = {
	user: state => state.user,
	authorities: state => state.authorities,
	system: state => state.system,
	platInfo: state => state.platInfo,
	unionInfo: state => state.unionInfo,
	banner: state => state.banner,
	color: state => state.color,
}

// actions
const actions = {
	login ({commit, state,dispatch}, {identify, password}){
		return new Promise((resolve,reject)=>{
			$API.user.login({identify,password}, resp => {
        		commit(types.INIT_USER_INFO, resp)
        		if(resp.user && resp.user.authorityGroupId){
					dispatch('getUserAuthorities',{uuid:resp.user.authorityGroupId})
				}

        		commit(types.CLEAR_ANALYZE_INFO)
				dispatch('getSystemInfo');
				dispatch('getSettingInfo');

				if(resp.user.platId){
					dispatch('getPlatInfo',{uuid:resp.user.platId});
				}
				if(resp.user.unionId){
					dispatch('getUnionInfo',{uuid:resp.user.unionId});
				}

				resolve(resp);
			},resp => {
				resolve(resp);
			})
	    })
	},
	userMy({ commit, state, dispatch }){
	    return new Promise((resolve, reject) => {
			$API.user.userMy(resp => {
				commit(types.GET_USER_MY_INFO, resp)
				if(resp.user && resp.user.authorityGroupId){
					dispatch('getUserAuthorities',{uuid:resp.user.authorityGroupId})
				}
        		commit(types.CLEAR_ANALYZE_INFO)
				dispatch('getSystemInfo');
				dispatch('getSettingInfo');

				if(resp.user.platId){
					dispatch('getPlatInfo',{uuid:resp.user.platId});
				}
				if(resp.user.unionId){
					dispatch('getUnionInfo',{uuid:resp.user.unionId});
				}
				resolve(resp);
			},resp => {
				resolve(resp);
			})
	    })
	},
	getUserAnalyzeInfo({commit, state,dispatch},{user}){
		commit(types.CLEAR_ANALYZE_INFO);
		dispatch('getSystemInfo');
		if(user.platId){
			dispatch('getPlatInfo',{uuid:user.platId});
		}
		if(user.unionId){
			dispatch('getUnionInfo',{uuid:user.unionId});
		}
	},
	getUserAuthorities ({commit, state,dispatch}, {uuid}){
		return new Promise((resolve,reject)=>{
			$API.limit.getAccountGroupDetail({uuid}, resp => {
        		commit(types.INIT_USER_AUTHORITIES, resp)
				resolve(resp);
			},resp => {
				resolve(resp);
			})
	    })
	},
	getUserDetail({ commit, state, dispatch },{user_id}){
		return new Promise((resolve, reject) => {
			$API.user.getUserDetail({user_id},resp => {
				resolve(resp);
			},resp => {
				resolve(resp);
			})
	    })
	},
	getSystemInfo({ commit, state, dispatch }){
		return new Promise((resolve, reject) => {
			$API.user.getSystemInfo(resp => {
        		commit(types.INIT_SYSTEM_INFO, resp)
				resolve(resp);
			},resp => {
				resolve(resp);
			})
	    })
	},

	getPlatInfo({ commit, state, dispatch },{uuid}){
		return new Promise((resolve, reject) => {
			$API.user.getOrgInfo({uuid},resp => {
        		commit(types.INIT_PLAT_INFO, resp)
				resolve(resp);
			},resp => {
				resolve(resp);
			})
	    })
	},

	getUnionInfo({ commit, state, dispatch },{uuid}){
		return new Promise((resolve, reject) => {
			$API.user.getOrgInfo({uuid},resp => {
        		commit(types.INIT_UNION_INFO, resp)
				resolve(resp);
			},resp => {
				resolve(resp);
			})
	    })
	},

	changeMobile({ commit, state, dispatch },{uuid,mobile}){
		return new Promise((resolve, reject) => {
			$API.user.changeMobile({uuid,mobile},resp => {
        		commit(types.CHANGE_MOBILE, mobile)
				resolve(resp);
			},resp => {
				resolve(resp);
			})
	    })
	},

	getSettingInfo({ commit, state, dispatch },){
		return new Promise((resolve, reject) => {
			var list = ['banner','color'];
				$API.user.getSettingInfo({key:'banner'},resp => {
	        		commit(types.GET_USER_SETTING_INFO, {key:'banner',value:resp.value})
				},resp => {
				})
				$API.user.getSettingInfo({key:'color'},resp => {
	        		commit(types.GET_USER_SETTING_INFO, {key:'color',value:resp.value})
				},resp => {
				})
			
	    })
	},
	

}



// mutations
const mutations = {
	[types.INIT_USER_INFO](state,data) {
	    state.user = data.user;
	    let requestParam = {
	        token: data.token,
	        plat:'web',
	    }
	    localStorage.setItem("requestParam", JSON.stringify(requestParam));
      	$axios.defaults.params = requestParam;//重新修改全局联网配置
	},
	[types.GET_USER_MY_INFO](state,data) {
	    state.user = data.user;
	},
	[types.INIT_USER_AUTHORITIES](state,data) {
	    state.authorities = data.authorityGroup.authorities;
	},
	[types.INIT_SYSTEM_INFO](state,data) {
	    state.system = data.org;
	},
	[types.INIT_PLAT_INFO](state,data) {
	    state.platInfo = data.org;
	},
	[types.INIT_UNION_INFO](state,data) {
	    state.unionInfo = data.org;
	},
	[types.CLEAR_ANALYZE_INFO](state,data) {
	    state.system = null;
	    state.platInfo = null;
	    state.unionInfo = null;
	},
	[types.CHANGE_MOBILE](state,mobile) {
	    state.user.mobile = mobile;
	},
	[types.GET_USER_SETTING_INFO](state,{key,value}) {
		console.log(key);
		if(key == 'color'){

			console.log(value);
			if(value){
				state[key] = JSON.parse(value);
			}
		}else{
			if(state[key] || state[key] == ''){
		    	state[key] = value;
		    }
		}
	    
	},


}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}

