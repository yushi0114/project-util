# project-util

打包工具

## startup

1. 将 `.env.template` 改为 `.env` 修改其中的设置
2. `npm install`
3. 打包 & 发布

Note: 需要配置 SSH 免密登录

``` bash
$ npm run build 
$ npm run deploy

# or

$ npm run release # npm run build & npm run deploy
```

## 文件结构

``` bash
# before
/
|- project-util/
|- melib/
    |- melib-corp-service/
    |- melib-sys-service/
    |- melib-main-service/
    |- melib-web/

# after
/
|- project-util/
    |- dist/
        |- melib-corp-service.MMDD-HHmm.zip/
        |- melib-sys-service.MMDD-HHmm.zip/
        |- melib-main-service.MMDD-HHmm.zip/
        |- melib-web.MMDD-HHmm.zip/
|- melib/
    |- melib-corp-service/
    |- melib-sys-service/
    |- melib-main-service/
    |- melib-web/


```

### SSH 免密登录

``` bash
# 先登录远程服务器
$ ssh user@<host>
# input password

# 复制公钥 .pub 到 authorized_keys 文件
~$ vi .ssh/authorized_keys

# 如果没有需要创建
~$ mkdir .ssh
~$ touch .ssh/authorized_keys
~$ chmod 700 -R .ssh
~$ chmod 600 .ssh/authorized_keys
```