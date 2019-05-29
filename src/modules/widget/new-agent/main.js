import Vue from 'vue';
import Main from './main.vue'


let NewAgentConstructor = Vue.extend(Main)

let instance;

const NewAgent = options => {
	options = options || {};
	if (typeof options === 'string') {
	    options = {
	      	NewAgent: options
	    }
	}
	instance = new NewAgentConstructor({
    	data: options
  	});
  	document.getElementById('app').appendChild(instance.$mount().$el);
  	
}

export default NewAgent