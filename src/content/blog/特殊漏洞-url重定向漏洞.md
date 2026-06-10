---
title: url重定向漏洞
date: 2026-06-09
categories:
  - 特殊漏洞
tags: []
---

## 原理：

开发人员没有对用户输入的url参数做验证，导致了网站重定向到另一个站点

### 类型：

1. get形式：
直接在url中含有重定向的url参数，可以试着修改一下看看可不可以

2. <meta>和javascript
<meta>  标签可以告知浏览器刷行网页，并且向其中的content属性定义的url发起get请求
当我们可以控制这个content的时候，或者可以通过其他的漏洞注入的时候就可以进行下一步的攻击了

3. js类型的
js的dom中的window对象的location属性可以实现重定向，可以通过一些脚本修改window的location属性
window.location=http://xxxxxx
window.location.href=https://xxxxx
window.location.replace(https://xxxxx)
需要有js的执行权限

