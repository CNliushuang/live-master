import Vue from 'vue';
import Main from './Main.vue'

let SelectUnionConstructor = Vue.extend(Main)

let instance;

const SelectUnion = options => {
	options = options || {};
	if (typeof options === 'string') {
	    options = {
	      	SelectUnion: options
	    }
	}

	instance = new SelectUnionConstructor({
    	data: options
  	});

  	document.getElementById('app').appendChild(instance.$mount().$el);
}
export default SelectUnion