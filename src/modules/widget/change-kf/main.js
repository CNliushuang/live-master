import Vue from 'vue';
import Main from './main.vue'


let ChangeKfConstructor = Vue.extend(Main)

let instance;

const ChangeKf = options => {
	options = options || {};
	if (typeof options === 'string') {
	    options = {
	      	ChangeKf: options
	    }
	}
	instance = new ChangeKfConstructor({
    	data: options
  	});
  	document.getElementById('app').appendChild(instance.$mount().$el);
  	
}

export default ChangeKf