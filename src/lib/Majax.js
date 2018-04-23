/*
	支持：
		* ajax  	XMLHttpRequest()
		* jsonp		script
 */

function Ajax(options){
	// 默认值
	var defaults = {
		type:'get',//post,put,delete...,jsonp
		async:true,
		jsonpName:'callback'
	}

	// 扩展参数
	var opt = Object.assign({},defaults,options);

	this.init(opt);
}

Ajax.prototype = {
	init(opt){
		// 处理请求类型大小
		opt.type = opt.type.toLowerCase();

		// opt.data:{pageNo:1,qty:2} => 'pageNo=1&qty=2';
		// 改变参数格式
		var params = '';

		for(var attr in opt.data){
			params += attr + '=' + opt.data[attr] + '&';
		}

		// 去除多余的&
		params = params.slice(0,-1);

		var type = ['get','jsonp'];
		// if(opt.type === 'get' || opt.type === 'jsonp'){
		if(type.indexOf(opt.type) >= 0){
			var op = opt.url.indexOf('?') >=0 ? '&':'?';//?,&
			opt.url += op + params;

			params = null;
		}


		// jsonp请求
		if(opt.type === 'jsonp'){
			var callbackName = 'getData' + Date.now();//getData1213165465432165

			var script;

			// 创建全局函数
			window[callbackName] = function(data){
				var res = data;
				try{
					res = JSON.parse(res);
				}catch(err){
					try{
						res = eval('(' + res + ')');
					}catch(er){

						res = res;
					}
				}
				opt.success(res);

				// 请求完成后，删除script标签
				script.parentNode.removeChild(script)
			}

			// 生成script标签
			script = document.createElement('script');
			script.src = opt.url + '&'+opt.jsonpName+'=' + callbackName;
			document.body.appendChild(script);

			return;
		}


		var xhr = null;
		try{
			xhr = new XMLHttpRequest();
		}catch(error){
			try{
				 // ie低版本浏览有多种异步请求的实现
				 xhr = new ActiveXObject("Msxml2.XMLHTTP");
			}catch(err){
				try{
					xhr = new new ActiveXObject("Microsoft.XMLHTTP");
				}catch(e){
					alert('你的浏览器太low，赶紧换电脑');
				}
			}
		}

		var arr_status = [200,304];


		// 处理返回数据
		xhr.onload = function(){
			if(arr_status.indexOf(xhr.status) >= 0){
				var res = xhr.responseText;
				try{
					res = JSON.parse(res);
				}catch(err){
					try{
						res = eval('(' + res + ')');
					}catch(er){
						res = res;
					}
				}

				try{
					opt.success(res)
				}catch(error){return;}
			}
		}

		



		// 配置参数，建立与服务器连接
		xhr.open(opt.type,opt.url,opt.async);

		// post请求，设置请求头
		if(opt.type === 'post'){
			xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
		}

		xhr.send(params);
	}
}

Object.defineProperty(Ajax.prototype,'constructor',{
	configurable:true,
	value:Ajax
});

function ajax(options){
	return new Ajax(options);
}

ajax.get = function(options){
	options.type = 'get';
	return new Ajax(options);
}
ajax.post = function(options){
	options.type = 'post';
	return new Ajax(options);
}
ajax.jsonp = function(options){
	options.type = 'jsonp';
	return new Ajax(options);
}

// ajax.get({url,success,data});
// ajax.post({type:'get',url,success,data});
// ajax.jsonp();

// new Ajax({

// });

// ajax({type:'jsonp',url:'http://tianqi.com',success:function(data){//用户代码},data:{},jsonpName:'cb'})
// ajax({type:'jsonp',url:'http://www.baidu.com',success:function(data){//用户代码},data:{},jsonpName:'cb'})