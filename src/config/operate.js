export const Operate = (user,path,nav,authorities) => {
	var result = false;
	if(user && user.userType == 'SUPER_ADMIN'){
		result = true;
		return result;
	}
	if(nav){
		let uuid = '';
		let key = '';
		function fn(list){
			for(var items of list){
				if(items.path && items.path == path){
					uuid = items.uuid
					key = items.children && items.children.length > 0?'model':'name';
				}
				if(items.children){
					fn(items.children)
				}
			}
		}
		fn(nav);
		if(uuid){
			for(var items of authorities){
				if(items[key] == uuid && items.writeStatus == 1){
					result = true;
				}
			}
		}
	}
	return result;
}