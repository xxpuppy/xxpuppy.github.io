---
title: 概述
date: 2026-06-09
categories:
  - web服务器+中间件漏洞总结
tags: []
---

原理：利用web服务器或者应用服务器的解析漏洞、配置错误或者已知漏洞

## 常见的中间件：

- Apache：解析漏洞、mod_cgi配置错误

- Nginx：解析漏洞、目录穿越错误配置

- IIS：PUT漏洞、短文件名猜解、解析漏洞

- Tomcat：弱口令后台、WAR包部署getshell

- Weblogic：反序列化，SSRF

## Apache：

在kali上启动apache，然后进行漏洞复现

![image.png](/images/web服务器+中间件漏洞总结/image.png)

### 目录遍历漏洞：

直接访问：

```Plain Text
https://ip:port/upload(uploads)
```

可以看到目录遍历的文件，可以下载看看有没有敏感文件，可以使用谷歌语法开搜索

![image.png](/images/web服务器+中间件漏洞总结/image%201.png)

### 未知拓展名解析漏洞（多后缀解析漏洞）：

原理：
apache会从右到左依次解析文件，解析到可以解析的后缀名就停止,比如

```Plain Text
<?php phpinfo(); ?>
```

如果文件名叫做 1.php.xax很明显.xax的后缀名是不可能被解析的，所以apache会自动前移到1.php，于是上传成功过后直接访问就可以看到phpinfo的结果了

### 换行解析漏洞：

在apache添加了php的组件过后，本地的php是作为apache的mod方式运行的，所以需要在mods-enabled目录下面找到apache-php的配置

![image.png](/images/web服务器+中间件漏洞总结/image%202.png)

在这上面可以看到：

```php
<FilesMatch "\.ph(?:p[arl]|tml)$">
    SetHandler application/x-httpd-php
</FilesMatch>

<FilesMatch "\.phps$">
    SetHandler application/x-httpd-php-source
    # Deny access to raw php sources by default
    # To re-enable it's recommended to enable access to the files
    # only in specific virtual host or directory
    Require all denied
</FilesMatch>

<FilesMatch "^\.ph(?:p[arl]|tml)?$">
    Require all denied
</FilesMatch>
```

这个".ph(?:p[arl]|tml)$"表示的是一个匹配的表达式，表示匹配这几个文件：.php/.phar/.php1/.phtml，这其中的$也会匹配换行符（\x0A）

所以说使用条件：

- 使用module模式，且有危险配置

- 文件拓展名中至少有一个.php

打法：

直接在传入的文件里面加入\x0A

### AddHandler导致的解析漏洞：

原理：配置文件中使用了

```php
AddHandler application/x-httpd-php .php
```

这样只要有.php文件都会被当作php解析，于是可以上传shell.php.xxx来绕过黑白名单就可以成功上传了

### 目录遍历：

错误配置导致机器的目录直接暴露在了公网上

谷歌语法：

```Plain Text
intitle="index of"
```

### SSI远程命令执行

- SSI是什么：
ssi提供了一种对现有的html文档增加动态内容的方法，就是在html中加入动态的内容，在测试任意文件上传的时候，目标的服务器可能不允许上传php后缀的文件，于是可以通过上传一个shtml的文件，并且通过<!--#exec cmd="ls /" -->来执行任意的命令

- 条件：

    - 目标服务器开启了SSI与CGI支持

## Nginx

### 文件解析漏洞：

这个漏洞与Nginx版本和php版本都无关，最主要是关于用户配置的原因，是用户配置不当，导致对于任何用户上传的文件都被当作php文件解析了

比如一个php文件里面是一个phpinfo()，但是名字却叫1.png，传上去过后就会被当作php文件解析 

### 目录穿越漏洞：

#### 原理：

在Nginx反向代理的时候，动态的部分被proxy_pass传递给了后端端口，二静态的文件需要Nginx来处理，假设静态文件存储在/home/目录之下，但是这个目录在url中的名字为files，那么就需要使用alias设置目录的别名

```Plain Text
location /files
{
  alias /home/;
}
```

这个时候访问http://xxx.com/files/readme.txt，就可以获取/home/readme.txt文件，但是注意到url上的/file没有加后缀/，但是alias设置的是有后缀的，于是导致了可以穿越到上层目录

#### 利用：

直接访问http://xxx.com/files../

就可以了

## IIS



[swagger，druid，actuator，webpack](/web服务器+中间件漏洞总结-swagger，druid，actuator，webpack/)

