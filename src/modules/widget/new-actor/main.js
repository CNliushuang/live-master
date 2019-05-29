import Vue from 'vue';
import Main from './main.vue'


let NewActorConstructor = Vue.extend(Main)

let instance;

const NewActor = options => {
	options = options || {};
	if (typeof options === 'string') {
	    options = {
	      	NewActor: options
	    }
	}

	if(!options.actor.shareProperties){
        var temp = [{
            shareRatio:"",
            maxLimit:"",
            delete:0
        }]
        options.actor.shareProperties = temp;
    }else{
        for(var items of options.actor.shareProperties){
            items.delete = 0;
        }
    }
	
	instance = new NewActorConstructor({
    	data: options
  	});
  	document.getElementById('app').appendChild(instance.$mount().$el);
  	
}

export default NewActor