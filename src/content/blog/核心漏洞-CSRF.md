---
title: CSRF
date: 2026-06-09
categories:
  - 核心漏洞
tags: []
---

## 个人理解：

csrf的本质是利用了cookie的特性，造成一个链接加载的特性，于是可以在各种可以上传图片的地方进行测试，先看看有没有存储图片参数可控，看看有没有可以利用链接的地方，然后就可以进一步测试了

## cookie作用机理

- 作用：
http协议是无状态的，所以利用cookie来解决状态持续性问题

- 形式：
cookie以键值对的形式存储

- 生成与存储：
在需要身份记录的时候，服务端会发送带有set-cookie头的响应包，然后存储在本地浏览器，之后登录网站的时候发送的请求包会带上本地的cookie，服务端可以自定义cookie的key，value，过期时间等等



## 漏洞成因：

一般是没有检查Referer以及未在头部设置token造成的

**Referer**主要用于记录请求来源，**Token**主要用于身份验证与授权

## 漏洞原理：

两个前提：

1. 用户已经在目标网站上登录，而且在本地存储了cookie

2. 恶意的http请求会自动携带cookie

## CSRF的分类：

### 1. GET类型的

以GET请求来完毕银行转账的操作，如：直接点击链接来完成操作


```javascript
http://www.mybank.com/Transfer.php?toBankId=11&money=1000 
```

危险站点B：它里面有一段HTML代码如下：

```html
<img src=http://www.mybank.com/Transfer.php?toBankId=11&money=1000>

```

这是利用了浏览器在渲染img标签的时候，向src中的站点自动发起了一个http请求，而且这个请求是附加了本地的cookie的，所以导致了漏洞的产生

可以利用的标签：
<image src=><iframe src=><script>

### 2. POST类型的

这类的csrf需要构造一个自动提交的表单，可以自己制作一个网页，然后在网页中直接隐藏一个表单，构造post提交

### 3. Token验证：

- token
在Web开发中，token是指一种用于验证用户身份或执行权限的令牌。它通常是一个字符串，可以被包含在请求中的头部、URL参数、或者请求体中，用于向服务器证明用户的身份或权限。
当随机生成token后，我们可以通过 XSS漏洞获取当前页面的token，同时构造恶意链接。或者直接利用Burp的CSRF token插件来进行自动更新token。

## 攻击思路：

### 判断有无CSRF漏洞：

抓包看看有无Referer或者token，没有就极有可能有漏洞

### 常用攻击标签：（get）

```html
<a href="http://xxx.com/?money=xxx&user=xxx">xxx</a>
<img src="http://xxx.com/?money=xxx&user=xxx"> 
<iframe src="http://xxx.com/?money=xxx&user=xxx"> <iframe>
// iframe可以添加style=“dispiay：none”来隐藏攻击内容



```

### 短链接伪装：

短链接伪装是指将一个较长的原始链接转换为一个较短的链接，使这个链接看起来像一个可以信任的源，从而欺骗用户点击该链接。

直接在网上搜一个短链接生成工具，将我们的恶意代码输入，即可得到短链接。

### 类型转换（更新请求办法）

当敏感信息通过get请求发送时，我们可以尝试转换为POST发送，当以POST发送时，可以尝试转换为GET来发送，应用程序可能会执行，且没有任何保护机制，此时就可以实现类型转换绕过

### 绕过Referer检测

Referer检测的原理是，服务器端在接收到HTTP请求时，检查请求头中的Referer字段，如果该字段的值与期望的来源不符，则拒绝处理该请求，以防止恶意的CSRF攻击。例如，当用户在网站A登录后，浏览器发送请求到网站B的页面，如果网站B的服务器端进行了Referer检测，发现Referer字段不是网站A的地址，就会拒绝处理该请求。

绕过方式：
因为host与Referer不相同，虽然ip地址不能改，但是我们可以修改文件名，使其和Host一致，这样我们就可以绕过了，
当然，也可以直接删除Referer来绕过

### 绕过Token

- 删除Token参数

- 发送空的Token

