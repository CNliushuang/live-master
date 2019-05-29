import Vue from 'vue';
import Main from './main.vue'


let AccountGroupConstructor = Vue.extend(Main)

let instance;

const AccountGroup = options => {
	options = options || {};
	if (typeof options === 'string') {
	    options = {
	      	AccountGroup: options
	    }
	}
	instance = new AccountGroupConstructor({
    	data: options
  	});
  	document.getElementById('app').appendChild(instance.$mount().$el);
  	
}

export default AccountGroup