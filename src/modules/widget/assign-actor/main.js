import Vue from 'vue';
import Main from './main.vue'


let AssignActorConstructor = Vue.extend(Main)

let instance;

const AssignActor = options => {
	options = options || {};
	if (typeof options === 'string') {
	    options = {
	      	AssignActor: options
	    }
	}
	instance = new AssignActorConstructor({
    	data: options
  	});
  	document.getElementById('app').appendChild(instance.$mount().$el);
  	
}

export default AssignActor