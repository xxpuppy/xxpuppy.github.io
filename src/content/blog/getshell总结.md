---
title: getshell总结
date: 2026-06-09
tags: []
---

## OA getshell

### 泛微OA：

![image.png](/images/getshell总结/image.png)

![image.png](/images/getshell总结/image%201.png)

泛微e-mobile

![image.png](/images/getshell总结/image%202.png)

### 用友OA：

![image.png](/images/getshell总结/image%203.png)

![image.png](/images/getshell总结/image%204.png)

![image.png](/images/getshell总结/image%205.png)

### 致远OA：

最主要的特征是seeyon，在baseurl，一些数据包，url的某一些字段等等都有seeyon的字段

![image.png](/images/getshell总结/image%206.png)

### 蓝棱OA

![image.png](/images/getshell总结/image%207.png)

当然每一个的OA都还有细分的版本，可以看看有没有特定的Nday

### 利用工具：

[https://github.com/R4gd0ll/I-Wanna-Get-All/releases
](https://github.com/R4gd0ll/I-Wanna-Get-All/releases
)或者使用漏扫来直接梭哈，比如：goby,nuciel,Tscanplus,xpoc,afrog,yakit,fscan等等

### 更多的poc库

[https://baizesec.github.io/bylibrary/%E6%BC%8F%E6%B4%9E%E5%BA%93/](https://baizesec.github.io/bylibrary/%E6%BC%8F%E6%B4%9E%E5%BA%93/)



[https://www.yuque.com/xiaoai-7mfyv/nl9lag?](https://www.yuque.com/xiaoai-7mfyv/nl9lag?)   密码：smaf

[https://wiki.96.mk/Web%E5%AE%89%E5%85%A8/%E6%B7%B1%E4%BF%A1%E6%9C%8D/%E6%B7%B1%E4%BF%A1%E6%9C%8D%20SSL%20VPN%20-%20Pre%20Auth%20%E4%BB%BB%E6%84%8F%E5%AF%86%E7%A0%81%E9%87%8D%E7%BD%AE/](https://wiki.96.mk/Web%E5%AE%89%E5%85%A8/%E6%B7%B1%E4%BF%A1%E6%9C%8D/%E6%B7%B1%E4%BF%A1%E6%9C%8D%20SSL%20VPN%20-%20Pre%20Auth%20%E4%BB%BB%E6%84%8F%E5%AF%86%E7%A0%81%E9%87%8D%E7%BD%AE/)

## CMS getshell

### Wordpress

![image.png](/images/getshell总结/image%208.png)

[https://github.com/yubsy/Wordpress-Exploits
](https://github.com/yubsy/Wordpress-Exploits
)[https://github.com/wpscanteam/wpscan](https://github.com/wpscanteam/wpscan
)

### 禅道cms

![image.png](/images/getshell总结/image%209.png)

[https://github.com/charonlight/ZentaoExploitGUI/releases/tag/v1.1](https://github.com/charonlight/ZentaoExploitGUI/releases/tag/v1.1
)

### dedecms

![image.png](/images/getshell总结/image%2010.png)

[https://github.com/shmilylty/dedecmscan](https://github.com/shmilylty/dedecmscan
)

### joomla

![image.png](/images/getshell总结/image%2011.png)

[https://github.com/TheM4hd1/JCS](https://github.com/TheM4hd1/JCS
)

### 综合扫描工具：

[https://github.com/qianxiao996/FrameScan-GUI
](https://github.com/qianxiao996/FrameScan-GUI
)

## 组件，框架getshell

### shiro：

在登录框有记住我，或者在数据包中有remember-me，或者在set-cookie中有remember-me的这些，多半就是shiro的框架

直接使用工具梭哈

[https://github.com/SummerSec/ShiroAttack2](https://github.com/SummerSec/ShiroAttack2
)



有key无链:

[https://github.com/wyzxxz/shiro_rce_tool 
](https://github.com/wyzxxz/shiro_rce_tool 
)

### struts2：

遇到.do/.action这些结尾的网站一般都是struts2的框架，可以直接使用工具梭哈

[https://github.com/abc123info/Struts2VulsScanTools](https://github.com/SummerSec/ShiroAttack2
)

### Spring：

spring的特征是这样

![image.png](/images/getshell总结/image%2012.png)

看到这个logo就是这样的

或者这样的

![image.png](/images/getshell总结/image%2013.png)

[https://github.com/CllmsyK/YYBaby-Spring_Scan 
](https://github.com/CllmsyK/YYBaby-Spring_Scan 
)[https://github.com/charonlight/SpringExploitGUI
](https://github.com/charonlight/SpringExploitGUI
)

### thinkphp：

先用指纹再用工具

[https://github.com/nex121/ThinkphpGUI 
](https://github.com/nex121/ThinkphpGUI 
)[https://github.com/XiLitter/Tp_Attack_GUI ](https://github.com/XiLitter/Tp_Attack_GUI )

[https://github.com/Lotus6/ThinkphpGUI 
](https://github.com/Lotus6/ThinkphpGUI 
)

### laravel

![image.png](/images/getshell总结/image%2014.png)

直接工具梭哈

[https://github.com/SecPros-Team/laravel-CVE-2021-3129-EXP
](https://github.com/SecPros-Team/laravel-CVE-2021-3129-EXP
)该框架重点关注一下debug漏洞，泄露源码，运气好了会泄露数据库账号密码。

### 综合工具：

- liqunkit
[https://pan.quark.cn/s/3376270fd1d3
](https://pan.quark.cn/s/3376270fd1d3
)

## SQL注入，数据库 getsehll

### sqlmap：

使用sqlmap成功后，使用-os-shell参数就可以直接得到shell

### MDUT：

一个支持多款数据库直接rce的工具：（需要有数据库账号密码）

[https://github.com/SafeGroceryStore/MDUT](https://github.com/SafeGroceryStore/MDUT)

## XXE Getshell



## SSRF getshell

### ssrf打redis

### ssrf打元数据

## 中间件getshell

原理：利用web服务器或者应用服务器的解析漏洞、配置错误或者已知漏洞

常见的中间件：

- Apache：解析漏洞、mod_cgi配置错误

- Nginx：解析漏洞、目录穿越错误配置

- IIS：PUT漏洞、短文件名猜解、解析漏洞

- Tomcat：弱口令后台、WAR包部署getshell

- Weblogic：反序列化，SSRF

## 文件上传getshell



## 反序列化getshell



## SSTI注入



## 任意文件读取



## 云资产 getshell

- 拿到aksk

## 高危端口爆破

|端口|服务|风险说明|
|-|-|-|
|​**22**​|​**SSH (安全外壳)​**​|​弱口令，版本协议漏洞|
|​**21**​|​**FTP (文件传输协议)​**​|​弱口令，明文传输，文件上传|
|​**23**​|​**Telnet (远程登录)​**​|​嗅探|
|​**3389**​|​**RDP (远程桌面协议)​**​||
|​**5900+​**​|​**VNC (虚拟网络计算)​**​|​弱口令，信息泄露|
|3306|mysql|弱口令，或者sql注入后使用数据库功能直接getshell|
|5432|PostgreSQL|弱口令，sql写入|
|1433|MSSQL（sql server）|弱口令，xd_cmdshell直接执行系统命令|
|6379|redis|未授权|
|27017|MongoDB|未授权|
|1521|Oracle Databse|弱口令|
|8080/8081|Tomcat/jenkins|弱口令，未授权|
|7001/7002|Weblogic|反序列化/弱口令|

## 重点关注系统：

- Nacos   [https://github.com/charonlight/NacosExploitGUI ](https://github.com/charonlight/NacosExploitGUI 
)

- 海康威视
[https://github.com/MInggongK/Hikvision- ](https://github.com/MInggongK/Hikvision- 
)

- jeecg-boot
[https://github.com/MInggongK/jeecg- ](https://github.com/MInggongK/jeecg- 
)

- xxl-job
[https://github.com/pureqh/xxl-job-attack ](https://github.com/pureqh/xxl-job-attack 
)

- 若依
[https://github.com/charonlight/RuoYiExploitGUI](https://github.com/charonlight/RuoYiExploitGUI
)
[https://github.com/kk12-30/ruoyi-Vue-tools/releases/tag/v5 ](https://github.com/kk12-30/ruoyi-Vue-tools/releases/tag/v5 
)

- 亿赛通
[https://github.com/CRlife/YisaiExploitGUI/blob/main/README.md](https://github.com/CRlife/YisaiExploitGUI/blob/main/README.md
)

- jenkis
[https://github.com/TheBeastofwar/JenkinsExploit-GUI
](https://github.com/TheBeastofwar/JenkinsExploit-GUI
)[https://github.com/charonlight/JenkinsExploitGUI](https://github.com/charonlight/JenkinsExploitGUI
)



