---
title: "git 相关总结"
date: 2017-06-02
categories:
 - 版本控制-Git
tags:
 - Git
---

# 关于git的总结

## git工作流

![pic](~@GitPic/git-flow.png)

## git相关

* [git 提交规范](https://www.conventionalcommits.org/zh/v1.0.0-beta.2/)
* [git 简明指南](http://rogerdudler.github.io/git-guide/index.zh.html)
* [git 在线教程](https://learngitbranching.js.org/)
* [git pro 中文教程](https://git-scm.com/book/zh/v2)

* [Commitizen](https://github.com/commitizen/cz-cli)是一个撰写合格 Commit message 的工具。

1.安装命令如下:

```bash
npm install -g commitizen
```

2.然后，在项目目录里，运行下面的命令，使其支持 Angular 的 Commit message 格式

```bash
commitizen init cz-conventional-changelog --save --save-exact
```

3.以后，凡是用到git commit命令，一律改为使用git cz。这时，就会出现选项，用来生成符合格式的 Commit message

![Alt text](~@GitPic/add-commit.png)

* 更多关于`Commit message 和 Change log 编写指南`可以到[Commit message 和 Change log 编写指南](http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)查看...

## git操作

### 合并某个分支上的文件到应一个分支、回退到某个版本和 远程服务器上面回退到某个版本

1. git 合并某个分支上的文件到另一个分支上`git checkout branch <path>`
2. git 本地回退到某个版本
```sh
git reset --hard 23bc94cf7e3c74c33dd4575dfbf72d6647333795
```
3. git 远程服务器上面回退到某个版本
```sh
# 可以 先把本地回退到某个版本
# 例如：
git reset --hard 23bc94cf7e3c74c33dd4575dfbf72d6647333795
# 然后再 强推到远程上面
git push -f
```

### 删除远程仓库上的某个文件夹

```bash
# 查看有哪些文件夹
$ dir
# 删除某个文件夹（本地项目中的文件夹不受操作影响,删除的只是远程仓库中的文件夹）
$ git rm -r --cached target
# 提交,添加操作说明
$ git commit -m '删除了xxx文件夹'

# 列子
git rm -r --cached .idea  #--cached不会把本地的.idea删除
git commit -m 'delete .idea dir'
git push -u origin master
```

### Git Tag

* `git tag`查看所有的标签
* `git tag -d tagName` 删除某个标签
* `git tag -a newName -m "注释"` 创建一个带注释的标签
* `git tag newName` 创建一个轻量级标签
* `git checkout tagName` 切换到某个标签
* 可以按照特定的表达式搜索某些标签
```sh
$ git tag -l v1.2.*
  v1.2.1
  v1.2.2
  v1.2.3
```
* `git push --tags` 默认情况下，`git push` 不会把 tag 上传到远程，为了共享这个 tag，可以在 git push 后面加 `--tags`
* `git stash` 暂存区和工作区的状态都会被保存
* `git show tagName` 查看该标签的信息
* 注意 *`tag`实际指向的是一次`commit`，`show tagName`展示出来的`diff`也是该次`commit`的`diff`*
* 删除本地标签 `git tag -d 标签名 `
* 删除远程标签 `git push origin :refs/tags/标签名`

### git 推送本地分支到远程和拉去远程分支到本地

```bash
git push <远程主机名> <本地分支名>:<远程分支名>
git fetch origin <远程分支名>:<本地分支名>
```

### git 回到远程仓库的状态

```sh
git fetch --all && git reset --hard origin/master
```

### git 放弃工作区的修改

```sh
git checkout <file-name>
# 放弃所有更改:
git checkout .
```

### 以新增一个commit的方式还原某一个commit的修改
```sh
git revert <commit-id>
```

### 回到某个commit的状态，并删除后面的commit
和revert的区别：reset命令会抹去某个commit id之后的所有commit

```sh
git reset <commit-id>  #默认就是-mixed参数。

git reset –mixed HEAD^  #回退至上个版本，它将重置HEAD到另外一个commit,并且重置暂存区和HEAD相匹配，但是也到此为止。工作区不会被更改。

git reset –soft HEAD~3  #回退至三个版本之前，只回退了commit的信息，暂存区和工作区与回前保持一致。如果还要提交，直接commit即可

git reset –hard <commit-id>  #彻底回退到指定commit-id的状态，暂存区和工作区也会变为commit-id版本的内容
```

### 以上是常用的几种，更多：

* [关于git的操作请访问Fork=>https://github.com/521xueweihan](<https://github.com/magicLaLa/git-tips>)


## git设置、PowerShell 插件 posh-git 安装、可视化界面的项目版本控制软件，适用于git项目管理

* Git 设置

```sh
# 设置 Git 全局：用户名、邮箱 ↓
git config --global user.name "youName"
git config --global user.email yourEmail@example.com

# 下面是针对每个 Git 项目的，非全局 ↓
git config user.email yourEmail@example.com
git config user.name "youName"

# 禁用git自动LF转CRLF
git config --global core.autocrlf false
# 生成密钥（默认文件名id_rsa）
# -t 密钥类型
# -C 注释
ssh-keygen -t rsa -C "邮箱"
```

哪个设为全局，哪个设为当前项目，按个人需求而定，并无绝对。

* PowerShell 插件 posh-git 安装

```sh
VSCode 默认使用PowerShell，启动powershell，分别执行下面3个命令（提示都输入Yes）
# 1.设置权限
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Confirm
# 2.使用PowerShellGet安装
PowerShellGet\Install-Module posh-git -Scope CurrentUser
# 3.全局导入posh-git
Add-PoshGitToProfile -AllHosts
```

* SourceTree拥有可视化界面的项目版本控制软件，适用于git项目管理
  [官网](https://www.sourcetreeapp.com/)
  基本使用: <https://www.cnblogs.com/tian-xie/p/6264104.html>

  ![SourceTree](~@GitPic/sourcetree.png)

## git常见错误处理

### 在 git commit 或者 git add 的时候报 Git: fatal: Unable to create 'f:/Vue-learning/.git/index.lock': File exists. 这个错误

* git 遇到这个错误时，需要把 当前项目下 .git -> index.lock 这个文件删除即可

![Alt text](~@GitPic/1323758-20180206172305857-1172749425.png)

### git merge 冲突，提示You have not concluded your merge (MERGE_HEAD exists)

```sh
# You have not concluded your merge (MERGE_HEAD exists).
# Please, commit your changes before you can merge.
# 可以先撤销合并(git的版本不同撤销命令也不同)
git merge --abort [Since git version 1.7.4]
git reset --merge [prior git versions]
```

### git clone 远程仓库地址url，在登录时输错密码或者账户导致clong失败

1. 打开电脑控制面板：

![控制面板](~@GitPic/kzmb.png)

2. 选择用户账户-->管理你的凭据

![电脑凭证](~@GitPic/dnpz.png)

3. 可以在下方用红框的地方修改

![修改](~@GitPic/pz.png)
![修改](~@GitPic/xg.png)

### git push 到 github 上报错：fatal: HttpRequestException encountered

```sh
fatal: HttpRequestException encountered.
   发送请求时出错。
      0 [main] bash (32364) e:\Program Files (x86)\Git\usr\bin\bash.exe: *** fatal error - cygheap base mismatch detected - 0x30C9408/0x2E49408.
This problem is probably due to using incompatible versions of the cygwin DLL.
Search for cygwin1.dll using the Windows Start->Find/Search facility
and delete all but the most recent version.  The most recent version *should*
reside in x:\cygwin\bin, where 'x' is the drive on which you have
installed the cygwin distribution.  Rebooting is also suggested if you
are unable to find another cygwin DLL.
      0 [main] bash 31852 fork: child -1 - forked process 32364 died unexpectedly, retry 0, exit code 0xC0000142, errno 11
bash: fork: retry: Resource temporarily unavailable
      0 [main] bash (31984) e:\Program Files (x86)\Git\usr\bin\bash.exe: *** fatal error - cygheap base mismatch detected - 0x30C9408/0x2EB9408.
This problem is probably due to using incompatible versions of the cygwin DLL.
Search for cygwin1.dll using the Windows Start->Find/Search facility
and delete all but the most recent version.  The most recent version *should*
reside in x:\cygwin\bin, where 'x' is the drive on which you have
installed the cygwin distribution.  Rebooting is also suggested if you
are unable to find another cygwin DLL.
1104150 [main] bash 31852 fork: child -1 - forked process 31984 died unexpectedly, retry 0, exit code 0xC0000142, errno 11
bash: fork: retry: Resource temporarily unavailable
      0 [main] bash (32460) e:\Program Files (x86)\Git\usr\bin\bash.exe: *** fatal error - cygheap base mismatch detected - 0x30C9408/0x2EE9408.
This problem is probably due to using incompatible versions of the cygwin DLL.
Search for cygwin1.dll using the Windows Start->Find/Search facility
and delete all but the most recent version.  The most recent version *should*
reside in x:\cygwin\bin, where 'x' is the drive on which you have
installed the cygwin distribution.  Rebooting is also suggested if you
are unable to find another cygwin DLL.
3187630 [main] bash 31852 fork: child -1 - forked process 32460 died unexpectedly, retry 0, exit code 0xC0000142, errno 11
bash: fork: retry: Resource temporarily unavailable
      0 [main] bash (20400) e:\Program Files (x86)\Git\usr\bin\bash.exe: *** fatal error - cygheap base mismatch detected - 0x30C9408/0x3019408.
This problem is probably due to using incompatible versions of the cygwin DLL.
Search for cygwin1.dll using the Windows Start->Find/Search facility
and delete all but the most recent version.  The most recent version *should*
reside in x:\cygwin\bin, where 'x' is the drive on which you have
installed the cygwin distribution.  Rebooting is also suggested if you
are unable to find another cygwin DLL.
7278726 [main] bash 31852 fork: child -1 - forked process 20400 died unexpectedly, retry 0, exit code 0xC0000142, errno 11
bash: fork: retry: Resource temporarily unavailable
      0 [main] bash (9192) e:\Program Files (x86)\Git\usr\bin\bash.exe: *** fatal error - cygheap base mismatch detected - 0x30C9408/0x2EF9408.
This problem is probably due to using incompatible versions of the cygwin DLL.
Search for cygwin1.dll using the Windows Start->Find/Search facility
and delete all but the most recent version.  The most recent version *should*
reside in x:\cygwin\bin, where 'x' is the drive on which you have
installed the cygwin distribution.  Rebooting is also suggested if you
are unable to find another cygwin DLL.
15370228 [main] bash 31852 fork: child -1 - forked process 9192 died unexpectedly, retry 0, exit code 0xC0000142, errno 11
bash: fork: Resource temporarily unavailable
error: failed to execute prompt script (exit code 254)
fatal: could not read Username for 'https://github.com': No error
```

* 导致：`fatal: HttpRequestException encountered` 这个的原因是github禁用了TLS1.0/1.1协议，[github禁用了对弱加密的支持](https://githubengineering.com/crypto-deprecation-notice/)，我们可以对 [git for windows](https://github.com/git-for-windows/git/releases) 更新到最新的版本或者去更新[windows的git凭证管理器](https://github.com/Microsoft/Git-Credential-Manager-for-Windows)，这样就可以了。

![pic](~@GitPic/1323758-20180712112225701-1623212436.png)

### git merge 冲突，提示You have not concluded your merge (MERGE_HEAD exists)

```sh
You have not concluded your merge (MERGE_HEAD exists).Please, commit your changes before you can merge.
```
- 可以先撤销合并

```sh
git merge --abort [Since git version 1.7.4]

git reset --merge [prior git versions]
```

### 撤销上一次 commit，将改动保留在暂存区
- 只想为之前的commit增加更多的改动，或者改变之前的提交信息

```sh
# 和git rest HEAD~ 有些类似，但是会将你的改动保留在暂存区内
get reset --soft HEAD~
```

### 通过 ssh-add 管理 ssh密钥，重启电脑后需要再次输入密钥密码

- ssh-add 这个命令不是用来永久性的记住你所使用的私钥的。实际上，它的作用只是把你指定的私钥添加到 ssh-agent 所管理的一个 session 当中。而 ssh-agent 是一个用于存储私钥的临时性的 session 服务，也就是说当你重启之后，ssh-agent 服务也就重置了。
- Mac 系统内置了一个 Keychain 的服务及其管理程序，可以方便的帮你管理各种秘钥，其中包括 ssh 秘钥。ssh-add 默认将制定的秘钥添加在当前运行的 ssh-agent 服务中，但是你可以改变这个默认行为让它添加到 keychain 服务中，让 Mac 来帮你记住、管理并保障这些秘钥的安全性，命令如下：

```sh
ssh-add -K [path/to/your/ssh-key]
```

### windows 使用 ssh-add 管理 ssh密钥

- windows 上可以使用 `scoop` 来安装 `git openssh`
- 使用 `ssh-add` 来添加密钥，如果失败，可以查看 `ssh-agent` 服务是否开启: *[stackoverflow相关问题](https://stackoverflow.com/questions/52113738/starting-ssh-agent-on-windows-10-fails-unable-to-start-ssh-agent-service-erro)*

```sh
> Get-Service ssh-agent
Status   Name               DisplayName
------   ----               -----------
Stopped  ssh-agent          OpenSSH Authentication Agent

> Set-Service -Name ssh-agent -StartupType Manual
> Start-Service ssh-agent
> Get-Service ssh-agent
Status   Name               DisplayName
------   ----               -----------
Running  ssh-agent          OpenSSH Authentication Agent
```

- 可以通过 `ssh-add -l` 来确私钥列表
- 可以通过 `ssh-add -D` 来清空私钥列表

### 配置多个SSH-Key

创建多个 ssh-key 并添加到远程仓库中，

- `ssh-keygen -t rsa -C "your_email@example.com" -f ~/.ssh/id_rsa_github`
- `ssh-keygen -t rsa -C "your_email@example.com" -f ~/.ssh/id_rsa_gitlab`

然后在本地 `.ssh` 文件夹下创建 `config` 文件 `touch config`，写入如下配置（*windows下路径为 `C:\Users\{用户}\.ssh`*）:

```sh
# gitlab
Host gitlab.com
    HostName gitlab.com
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/id_rsa_gitlab
# github
Host github.com
    HostName github.com
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/id_rsa_github
```

*注意：即使是同一个email地址，在不同的电脑上，都需要重新生成SSH-Key；然后再添加到git服务器的SSH-Key配置中。*

#### 测试

- 执行如下命令，查看我们配置是否成功 `ssh -T git@github.com`，如果成功输出欢迎语句，则表示配置成功。例如：`Hi hdszylcd19! You've successfully authenticated, but GitHub does not provide shell access.`
- 如果遇到错误的话，则可以使用如下命令，查看详细信息，定位具体原因 `ssh -vT git@github.com` *一般有问题大部分都是 host 写错啦~*

### 批量删除 某些分支

`git branch | grep 'xxxx' | xargs git branch -D`

* grep [命令用于查找文件里符合条件的字符串](https://www.runoob.com/linux/linux-comm-grep.html)
* xargs [是给命令传递参数的一个过滤器，也是组合多个命令的一个工具](https://www.runoob.com/linux/linux-comm-xargs.html)
* | 管道符