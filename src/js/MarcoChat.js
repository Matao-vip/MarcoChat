document.addEventListener('DOMContentLoaded',function(){
    var barrage=document.querySelector('.barrage');
    var userMsg_portrait=document.querySelector('#userMsg_portrait');
    var userMsg_name=document.querySelector('#userMsg_name');
    var scrn=barrage.querySelector('.scrn');
    var msg=barrage.querySelector('.msg');
    var btn_send=barrage.querySelector('.btn_send');
    var btn_quit=barrage.querySelector('.btn_quit');
    var send_hint=barrage.querySelector('.send_hint');
    var login=barrage.querySelector('.login').querySelector('span');
    var view=document.querySelector('.view');
    var datalist=document.querySelector('.datalist');
    var shade=document.querySelector('.shade');
    var form=document.querySelector('form');
    var username=document.querySelector('#username');
    var pass=document.querySelector('#pass');
    var gender=document.getElementsByName('gender');
    var btn_close=document.querySelector('.btn_close');
    var btn_resign=document.querySelector('.btn_resign');
    var mian=document.querySelector('#mian');

    // 登录框居中显示
    function locat(){
        form.style.left=(window.innerWidth-form.offsetWidth)/2+'px';
        form.style.top=(window.innerHeight-form.offsetHeight)/2+'px';
    }
    // 点击登录按钮，弹出遮罩和登录框
    login.onclick=function(e){
        shade.style.display="block";
        form.style.display="block";
        locat();
        username.focus();
    }
    // 点击登录框关闭按钮或按Esc键关闭登录框
    btn_close.onclick=function(){
        form.style.display='none';
        shade.style.display="none";
    }
    window.onkeydown=function(e){
        if(e.keyCode === 27){
            form.style.display='none';
            shade.style.display="none";
        }
    }

    //进入页面读取cookie，判断是否免登录
    function autoLogin(){
        var username=Cookie.get('username');
        var gender=Cookie.get('gender');
        if(!username==""){
            login.parentNode.style.display="none";
            userMsg_name.innerText=username;
            userMsg_portrait.classList.remove('icon-weidenglu-touxiang');
            if(gender==='male'){
                userMsg_portrait.classList.add('icon-hairstylestyle1');
            }else if(gender==='female'){
                userMsg_portrait.classList.add('icon-hairstylestyle');
            }
        }
    }
    autoLogin();
     
    // 点击登录框登录按钮，开启评论权限
    var _username;
    btn_resign.onclick=function(e){
        _username=username.value.trim();
        var _pass=String(pass.value);
        if(_username.length===0 || _username.length>5){
            username.parentNode.nextElementSibling.style.display="block";
            username.focus();
            e.preventDefault();
            return;
        }else if(_pass.length===0){
            pass.parentNode.nextElementSibling.style.display="block";
            pass.focus();
            e.preventDefault();
            return;
        }
        var _gender;
        for(var i=0;i<gender.length;i++){
            if(gender[i].checked){
                _gender=gender[i].value;
            }
        }
        // 判断男女
        userMsg_portrait.classList.remove('icon-weidenglu-touxiang');
        if(_gender==='male'){
            userMsg_portrait.classList.add('icon-hairstylestyle1');
        }else if(_gender==='female'){
            userMsg_portrait.classList.add('icon-hairstylestyle');
        }
        userMsg_name.innerText=_username;

        form.style.display='none';
        shade.style.display="none";
        login.parentNode.style.display="none";
        e.preventDefault();
        // 保存用户信息
        ajax.get({url:'../api/MarcoChat_user.php',data:{username:_username,pass:_pass,gender:_gender}});
        // 生成七天免登录cookie
        if(mian.checked){
            var date=new Date();
            date.setDate(date.getDate()+7);
            document.cookie='username='+_username+";expires="+date.toUTCString();
            document.cookie='gender='+_gender+";expires="+date.toUTCString();
        }
    }
    // 点击退出按钮，关闭评论权限
    btn_quit.onclick=function(){
        Cookie.remove('username');
        login.parentNode.style.display="block";
        userMsg_portrait.className='iconfont icon-weidenglu-touxiang';
        userMsg_name.innerText='游客';
    }

    // 在弹幕屏显示弹幕信息
    function viewMsg(msg){
        // 生成随机属性
        var color=randomColor();
        var fontSize=randomNumber(12,30);
        var top=randomNumber(10,scrn.clientHeight-fontSize-100);
        var speed=randomNumber(-2,-10);

        // 创建弹幕节点
        var item=document.createElement('span');
        item.className="item";
        item.innerHTML=msg;
        item.style.color=color;
        item.style.fontSize=fontSize+"px";
        item.style.top=top+"px";
        scrn.appendChild(item);

        // 移动弹幕
        var timer=setInterval(function(){
            var current=item.offsetLeft;
            var left = current + speed;
            if(current <= -item.offsetWidth){
                clearInterval(timer);
                item.parentNode.removeChild(item);
            }
            item.style.left= left + "px";
        },30)
    }
    // 每隔700ms发送一条弹幕，默认从第一条开始
    var current_msg_length; //记录第一次进入页面时弹幕库里的弹幕数量
    function ViewMsg(){
        ajax.get({
            url:'../api/data/MarcoChat_msg.json',
            success:function(data){
                current_msg_length=data.length;
                var index=0;
                var timers=setInterval(function(){
                    var msg=data[index].content;
                    viewMsg(msg);
                    index++;
                    if(index>=data.length){
                        clearInterval(timers);
                    }
                },700)
            }
        })
    }
    ViewMsg();
    function timeViewMsg(){
        ajax.get({
            url:'../api/data/MarcoChat_msg.json',
            success:function(data){
                var newAddMsg=data.slice(current_msg_length);
                newAddMsg.forEach(function(item){
                    viewMsg(item.content);
                })
                current_msg_length=data.length;
            }
        })
    }
    // 每隔500ms检查新弹幕并显示在弹幕屏上
    setInterval(timeViewMsg,500);

    // 进入页面，加载信息库(MarcoChar_msg.json)，在弹幕列表显示弹幕信息
    function showMsg(){
        ajax.get({
            url:'../api/data/MarcoChat_msg.json',
            success:function(data){

                // 生成弹幕列表
                var ul=document.createElement('ul');
                ul.innerHTML=data.map(item=>{
                    return `<li id="${item.id}">
                        <span class="nickname">${item.username}</span>
                        <span class="context">${item.content}</span>
                        <span class="Time">${item.time}</span>
                    </li>`
                }).join('');
                datalist.innerHTML='';
                datalist.appendChild(ul);

                // 滚轮置底
                datalist.scrollTop = datalist.scrollHeight;
            }
        })
    }
    showMsg();
    // 每隔300ms刷新弹幕列表
    var timer2=setInterval(showMsg,300);
    datalist.onmouseenter=function(){
        clearInterval(timer2);
    }
    datalist.onmouseleave=function(){
        timer2=setInterval(showMsg,300);
    }

    // 保存评论信息并显示弹幕信息
    function sendMsg(){
        // 获取昵称
        if(Cookie.get('username') != ""){
            _username=Cookie.get('username');
        }

        // 获取用户输入的弹幕内容（过滤敏感字符）
        var _msg=msg.value.trim();
        var arr_sensitive='fuck,你妈,shit,艹,我日,垃圾,草,操'.split(',');
        arr_sensitive.forEach(function(item){
            var reg = new RegExp(item,'gi');
            _msg = _msg.replace(reg,'**'); 
        })

        // 获取发送时间
        var now=new Date();
        var now=now.format("YYYY-MM-DD hh:mm");
        ajax.get({
            url:'../api/MarcoChat_msg.php',
            data:{username:_username,time:now,content:_msg},
            success:function(){showMsg();}
        });
        msg.value='';
        msg.focus();
    }

    // 点击发送按钮
    btn_send.onclick=function(){
        var _Msg=msg.value.trim();
        sendMsg();
    }
    // 移入发送按钮提示快捷键
    btn_send.onmousemove=function(e){
        send_hint.style.display="block";
        send_hint.style.left=e.clientX - barrage.offsetLeft + 10 + "px";
        send_hint.style.top=e.clientY - barrage.offsetTop + 10 + "px";
    }
    btn_send.onmouseout=function(){
        send_hint.style.display="none";
    }
    // 回车发送信息
    window.addEventListener('keydown',function(e){
        if(e.keyCode===13 && e.ctrlKey){
            var _Msg=msg.value.trim();
            sendMsg();
        }
    })
})