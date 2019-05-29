import Assign from './components/Assign'
import Management from './components/Management'
import Apply from './components/Apply'


const routes = [
	{ 
		path: '/actor/assign', component: Assign
	},
	{ 
		path: '/actor/management', component: Management
	},
	{ 
		path: '/actor/apply', component: Apply
	},
]

export default routes;