import Vue from 'vue';
import Main from './main.vue'


let NewPlatConstructor = Vue.extend(Main)

let instance;

const NewPlat = options => {
	options = options || {};
	if (typeof options === 'string') {
	    options = {
	      	NewPlat: options
	    }
	}
	instance = new NewPlatConstructor({
    	data: options
  	});
  	document.getElementById('app').appendChild(instance.$mount().$el);
  	
}

export default NewPlat