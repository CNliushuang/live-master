import Login from './components/Login'
import Information from './components/Information'
import Homepage from './components/Homepage'

const routes = [
	{ 
		path: '/information', component: Information
	},
	{
		path: '/home', component: Homepage

	}
]

const routes_root = [
	{ 
		path: '/login', component: Login
	},
]






export default {routes,routes_root};