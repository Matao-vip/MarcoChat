<?php
    $username=isset($_GET['username']) ? $_GET['username'] : null;
    $pass=isset($_GET['pass']) ? $_GET['pass'] : null;
    $gender=isset($_GET['gender']) ? $_GET['gender'] : null;
    if($username===null || $pass===null || $gender===null){
        return;
    }
    $path="data/MarcoChat_user.json";
    $file=fopen($path,'r');
    $content=json_decode(fread($file,filesize($path)),true);
    fclose($file);
    $length=count($content);
    class User{
        function __construct($length,$username,$pass,$gender){
            $this -> id= $length+1;
            $this -> uesrname=$username;
            $this -> pass=$pass;
            $this -> gender=$gender;
        }
    };
    $user=new User($length,$username,$pass,$gender);
    $content[] = $user;
    $content=json_encode($content,JSON_UNESCAPED_UNICODE);

    $file=fopen($path,'w');
    fwrite($file,$content);
?>