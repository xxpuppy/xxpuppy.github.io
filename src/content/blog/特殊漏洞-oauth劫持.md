---
title: oauth劫持
date: 2026-06-09
categories:
  - 特殊漏洞
tags: []
---

## oauth流程

以使用微信登录b站为例子（授权码模式）：

1. 客户端请求授权：
b站跳转到微信的授权页面，并且携带参数比如：

    2. client_id：b站在微信注册的应用id

    3. redirect_uri：授权成功过后要返回的b站页面

    4. scope：想要调取的权限范围

    5. response_type=code：告诉授权服务器要授权的模式

6. 用户确认授权：可以在微信看到b站请求获取你的昵称等，同意授权之后

7. 授权服务器返回授权码：在你同意之后，会返回到b站的redirect_uri页面，并且在url后面拼接一个授权码一般是?code=xxxxxxx，当然授权码是临时的

8. 客户端使用授权码换访问令牌
B站在后台对微信的授权服务器发起请求，携带参数如：

    9. client_id+client_secret：b站的应用ID+应用密码

    10. code：刚刚拿到的授权码

    11. grant_type=authorization_code：告诉微信要使用授权码，微信验证成功之后，会返回访问令牌和刷新令牌两个

## 测试：

自己测试要有两个账号A，B

- 在账号A上走完一遍绑定第三方平台的流程，然后把最后执行绑定动作的数据包send to repeater然后drop

- 在登录了账号b的浏览器上面，直接去访问A先前绑定的URL，观察B是否绑定了第三方平台



