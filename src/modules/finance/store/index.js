import account from './modules/account'
import flow from './modules/flow'
import reflect from './modules/reflect'
import actor from './modules/actor'
import agent from './modules/agent'
import union from './modules/union'

export default {
	namespaced: true,
	modules:{
		account,
		flow,
		reflect,
		actor,
		agent,
		union
	}
}