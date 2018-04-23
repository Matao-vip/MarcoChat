/* 
* @Author: Marco
* @Date:   2018-01-03 09:57:43
* @Last Modified by:   Marte
* @Last Modified time: 2018-01-24 13:02:04
*/

/**
 * [randomColor 生成随机颜色]
 * @Author    Marco
 * @DateTime  2018-01-04
 * @copyright [MT]
 * @version   [1.0]
 * @return    {[string]}    [rgb表示的随机颜色]
 */
function randomColor(){
    var r=parseInt(Math.random()*256);
    var g=parseInt(Math.random()*256);
    var b=parseInt(Math.random()*256);

    return "rgb("+r+","+g+","+b+")";
}


/**
 * [randomNumber 生成两个数之间的随机整数]
 * @Author    Marco
 * @DateTime  2018-01-07
 * @param     {[Number]}    min [最小值]
 * @param     {[Number]}    max [最大值]
 * @return    {[Number]}        [随机整数]
 */
function randomNumber(min,max){
    return parseInt(Math.random()*(max-min+1)+min);
}


/**
 * [vCode 生成随机验证码]
 * @Author    Marco
 * @DateTime  2018-01-07
 * @param     {[Number]}    num [验证码的位数]
 * @return    {[String]}        [生成的随机码]
 */
function vCode(num){
    if(num === undefined){
        num=4;
    }
    var res='';
    var arr="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    for(var i=0;i<num;i++){
        var idx=parseInt(Math.random()*arr.length);
        res+=arr[idx];
    }
    return res;
}


// 获取元素
var element={
    get:function(nodes){
        var res=[];
        for(var i=0;i<nodes.length;i++){
            if(nodes[i].nodeType===1){
                res.push(nodes[i])
            }
        }
        return res;
    },
    /**
     * [获取子元素]
     * @param  {[type]} ele [description]
     * @return {[type]}         [description]
     */
    children:function(ele){
        var nodes=ele.childNodes;
        return element.get(nodes);
    },

    // 获取下一个元素
    next:function(ele){
        var res=ele.nextSibling;
        if(res.nodeType===1){
            return res;
        }else{
            return res.nextSibling;
        }
    },

    // 获取上一个元素
    previous:function(ele){
        var res=ele.previousSibling;
        if(res.nodeType===1){
            return res;
        }else{
            return res.previousSibling;
        }
    }
}


/**
 * [获取样式兼容写法]
 * @param  {[element]} ele [要获取样式的元素]
 * @param  {[attribute]} attr [要获取的样式]
 * @return {[string]}         [样式值]
 */
function getCss(ele,attr){
    if(window.getComputedStyle){
        return getComputedStyle(ele)[attr];
    }else if(ele.currentStyle){
        return ele.currentStyle[attr];
    }else{
        return ele.style[attr];
    }
}

var Event={
    /**
     * [bind 绑定事件的方法，兼容所有浏览器]
     * @Author    Marco
     * @DateTime  2018-01-05
     * @param     {[Element]}    ele       [绑定事件的元素]
     * @param     {[String]}    type      [事件类型]
     * @param     {[Function]}    handler   [事件处理函数]
     * @param     {Boolean}   isCaptuer [是否捕获]
     */
    bind:function(ele,type,handler,isCaptuer){
        // W3C标准的事件监听器
        if(ele.addEventListener){
            ele.addEventListener(type,handler,isCaptuer)
        }
        // IE8-浏览器
        else if(ele.attachEvent){
            ele.attachEvent('on'+type,handler)
        }
        // DOM节点绑定方式
        else{
            ele['on'+type]=handler;
        }
    },
    // 删除事件
    remove:function(ele,type,handler,isCaptuer){
        if(ele.removeEventListener){
            ele.removeEventListener(type,handler,isCaptuer)
        }
        else if(ele.detachEvent){
            ele.detachEvent('on'+type,handler)
        }
        else{
            ele['on'+type]=null;
        }
    }
}


/**
 * [Cookie Cookie的增删查]
 * @type {Object}
 */
var Cookie={
    /**
     * [get 获取指定名字的cookie]
     * @Author    Marco
     * @DateTime  2018-01-07
     * @param     {[String]}    name [要获取的cookie名]
     * @return    {[Array]}         [获取的cookie值]
     */
    get:function(name){
        var res="";
        var cookies=document.cookie;
        if(cookies.length>0){
            cookies=cookies.split('; ');
            cookies.forEach(function(item){
                var temp=item.split('=');
                if(temp[0]===name){
                    res=temp[1];//JSON.parse在此处
                }
            })
        }
        return res;
    },
    /**
     * [set 设置cookie]
     * @Author    Marco
     * @DateTime  2018-01-07
     * @param     {[String]}    name  [cookie名]
     * @param     {[String]}    value [cookie值]
     * @param     {[Object]}    opt   [其他参数]
     */
    set:function(name,value,opt){
        var cookieStr=name + "=" + value;
        if(opt !== undefined){
            for(var attr in opt){
                cookieStr += ";" + attr + "=" + opt[attr];
            }
        }
        document.cookie=cookieStr;
    },
    remove:function(name){
        var date=new Date();
        date.setDate(date.getDate()-10);
        document.cookie= name + "=null;expires="+date.toUTCString();
    }
}

/**
 * [运动函数]
 * @Author    Marco
 * @DateTime  2018-01-15
 * @param     {element}    ele      [运动的对象]
 * @param     {Object}    opt      [运动的属性和目标值]
 * @param     {Function}  callback [回调函数]
 */
function animate(ele,opt,callback){
    ele.timerLen=0;
    for(var attr in opt){
        ele.timerLen++;
        (function(attr){
            // var now = new Date();
            // now=now.getTime()
            // var timername= "timer" + now;
            var timername=attr + "timer";
            var target = opt[attr];
            clearInterval(ele[timername]);
            ele[timername]=setInterval(function(){
                var current=getCss(ele,attr);
                // 获取单位
                var unit = current.match(/[a-z]+$/);
                unit = unit ? unit[0] : "";

                // 获取值
                current=parseFloat(current);

                // 计算速度
                var speed=(target-current)/10;
                speed = speed<0 ? Math.floor(speed) : Math.ceil(speed);
                if(attr === "opacity"){
                    speed = speed < 0 ? -0.02 : 0.02 ;
                }
                current += speed;
                if(current===target || speed===0){
                    clearInterval(ele[timername]);
                    current=target;
                    ele.timerLen--;
                    if(ele.timerLen===0){
                        typeof callback === "function" && callback();
                    }
                }
                ele.style[attr]= current + unit ;
            },30)
        })(attr)
    }
}

/**
 * [type 判断数据类型]
 * @Author    Marco
 * @DateTime  2018-01-24
 * @param     {All}    data [要判断的数据]
 * @return    {String}         [数据类型]
 */
function type(data){
    return Object.prototype.toString.call(data).slice(8,-1).toLowerCase();
}