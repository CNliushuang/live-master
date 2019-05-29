import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger'

import homeStore from '@/modules/home/store'
import userStore from '@/modules/user/store'
import actorStore from '@/modules/actor/store'
import limitStore from '@/modules/limit/store'
import platStore from '@/modules/platform/store'
import groupStore from '@/modules/group/store'
import financeStore from '@/modules/finance/store'
import agentStore from '@/modules/agent/store'
import logsStore from '@/modules/logs/store'
import analyzeStore from '@/modules/analyze/store'




Vue.use(Vuex)

const store = new Vuex.Store({
	modules:{
		homeStore,
		userStore,
		actorStore,
		limitStore,
		platStore,
		groupStore,
		financeStore,
		agentStore,
		logsStore,
		analyzeStore
	},
	plugins: process.env.NODE_ENV !== 'production'
    ? [createLogger()]
    : []
})
export default store;
