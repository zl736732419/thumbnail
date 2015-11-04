Array.prototype.remove = function(obj) {
	var index = -1;
	for(var i = 0; i < this.length; i++) {
		if(this[i] == obj) {
			index = i;
			break;
		}
	}
	
	if(index != -1) {
		this.splice(index, 1);
	}
}

//获取项目跟路径
function getRootPath()   
{   
     var pathName = window.location.pathname.substring(1);  
     var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));  
     return window.location.protocol + '//' + window.location.host + '/'+ webName + '/';   
}