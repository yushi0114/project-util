# project-util

打包工具

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
|- melib/
    |- melib-corp-service/
    |- melib-sys-service/
    |- melib-main-service/
    |- melib-web/
    |- build/
        |- melib-corp-service.MMDD-HHmm.zip/
        |- melib-sys-service.MMDD-HHmm.zip/
        |- melib-main-service.MMDD-HHmm.zip/
        |- melib-web.MMDD-HHmm.zip/

```


### usage

```
$ npm i

$ npm start
```