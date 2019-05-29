import Vue from 'vue';
import Main from './main.vue'


let NewUnionConstructor = Vue.extend(Main)

let instance;

const NewUnion = options => {
	options = options || {};
	if (typeof options === 'string') {
	    options = {
	      	NewUnion: options
	    }
	}
	instance = new NewUnionConstructor({
    	data: options
  	});
  	document.getElementById('app').appendChild(instance.$mount().$el);
  	
}

export default NewUnion