import Vue from 'vue';
import Main from './main.vue'


let ImportFlowConstructor = Vue.extend(Main)

let instance;

const ImportFlow = options => {
	options = options || {};
	if (typeof options === 'string') {
	    options = {
	      	ImportFlow: options
	    }
	}
	instance = new ImportFlowConstructor({
    	data: options
  	});
  	document.getElementById('app').appendChild(instance.$mount().$el);
  	
}




export default ImportFlow