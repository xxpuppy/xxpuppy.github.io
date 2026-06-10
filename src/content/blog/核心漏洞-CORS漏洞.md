---
title: CORS漏洞
date: 2026-06-09
categories:
  - 核心漏洞
tags: []
---

cors是用于解决sop（同源策略）的不足所产生的

## 原理：

cors有两类，简单请求与非简单请求。简单请求就是get，post，head三种之一，当浏览器发现服务器的请求为简单请求时，会在头里面加入Origin字段，代表此次请求来自哪个域，如果匹配的话，服务器就会在响应包中添加三个字段：

- Access-Control-Allow-Origin:

- Access-Control-Allow-Credentials

- Access-Control-Expose-Headers

其中的Access-Control-Origin是必须有的，剩下的两个可有可无，Access-Control-Allow-Origin这个字段代表的是允许哪些域名访问，如果说是*，这就代表什么域名都可以访问

