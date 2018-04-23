<?php
    $username=isset($_GET['username']) ? $_GET['username'] : null;
    $time=isset($_GET['time']) ? $_GET['time'] : null;
    $content=isset($_GET['content']) ? $_GET['content'] : null;
    if($username==null || $time==null || $content==null){
        return;
    }    

    $path="../api/data/MarcoChat_msg.json";
    $file=fopen($path,'r');
    $Content=json_decode(fread($file,filesize($path)),true);
    $length=count($Content);
    fclose($file);

    class Msg{
        function __construct($length,$username,$time,$content){
            $this -> id = $length+1;
            $this -> username = $username;
            $this -> time = $time;
            $this -> content = $content;
        }
    };
    $msg=new Msg($length,$username,$time,$content);
    $Content[]=$msg;
    $Content=json_encode($Content,JSON_UNESCAPED_UNICODE);

    $file=fopen($path,'w');
    fwrite($file,$Content);
?>