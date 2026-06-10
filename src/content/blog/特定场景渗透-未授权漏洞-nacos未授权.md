---
title: nacos未授权
date: 2026-06-09
categories:
  - 特定场景渗透
  - 未授权漏洞
tags: []
---

nacos是阿里开发的开源的中间件，nacos的常见的登录口，后台：

常见的弱口令：

nacos/nacos

![image.png](/images/nacos未授权/image.png)

![image.png](/images/nacos未授权/image%201.png)

## 漏洞详情：

老版本的nacos进行认证授权操作的时候，会判断请求的user-agent是不是“Nacos-server”如果是的话将不会进行任何的验证

### 影响版本；

Nacos≤2.0.0-ALPHA.1

## 挖掘流程：

首先对目标进行目录扫描，如果有的话就可以开始渗透了

首先遇到了登录口可以尝试一个弱密码nacos/nacos

然后尝试拼接一下

```Plain Text
nacos/v1/auth/users?pageNo=1&pageSize=1
```

如果出现了敏感信息，就可以推测大概率存在nacos未授权，然后可以抓包进行修改，发送至repeter中，post格式

将UA修改为“Nacos-Server”把报文修改为username=test1&password=test1，然后看看添加成功没有就可以了

