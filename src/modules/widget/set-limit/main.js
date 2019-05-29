import Vue from 'vue';
import Main from './main.vue'


let SetLimitConstructor = Vue.extend(Main)

let instance;

const SetLimit = options => {
	options = options || {};
	if (typeof options === 'string') {
	    options = {
	      	SetLimit: options
	    }
	}
	instance = new SetLimitConstructor({
    	data: options
  	});
  	document.getElementById('app').appendChild(instance.$mount().$el);
  	
}

export default SetLimit