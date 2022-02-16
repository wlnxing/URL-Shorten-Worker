# URL-Shorten-Worker
一个部署在cloudflare-worker上的简单短链程序，可自定义短链的路径，上手简单，适合个人小范围使用。

## 预览
![image](https://user-images.githubusercontent.com/77608284/154325886-d9b44b56-5b64-4f8e-8b16-59cfbb750f8c.png)

## 用法
在 "长链接" 框输入要缩短的长链接, 在下面的自定义路径处填写短链接的路径 (没有填写的话会自动生成一个随机路径) , 然后点击提交即可

> 自定义链接的最前面不用加`/` 

## 部署
### 登录cloudflare
 去[cloudflare](https://www.cloudflare.com/zh-cn/)登录或者创建账号，并绑定好域名。 
### 创建k-v命名空间
选择你要需要使用的域名，在右侧菜单中选择workers-->kv

![image](https://user-images.githubusercontent.com/77608284/154304938-8968750f-5176-424f-ada5-86caf7481a71.png)  

选择创建命名空间，输入命名空间的名称，然后点击添加

![image](https://user-images.githubusercontent.com/77608284/154305737-7a8cbdb5-04e9-4a1f-ab3e-bb0651b7b898.png)

### 创建workers
到右侧菜单点击worker(概述),点击创建服务

![image](https://user-images.githubusercontent.com/77608284/154308239-848f6584-2842-416b-afbe-1e2a42df43d4.png)

随后输入worker的名称，完成后点击创建

![image](https://user-images.githubusercontent.com/77608284/154308796-47db7527-6317-4ad4-ab10-ec520418f85e.png)

### 复制项目里的`worker.js`的代码到Worker里
到刚刚创建的worker里的资源-->快速编辑 将默认的代码删掉, 将项目里的`worker.js`里的代码复制到里面,点击保存并部署.


### 为worker绑定k-v命名空间

到刚刚创建的worker, 设置-->变量 滑倒最下面--KV 命名空间绑定, 点击添加绑定, 变量名称填`LINKS` KV命名空间选择刚刚创建的命名空间

![image](https://user-images.githubusercontent.com/77608284/154310499-407eca63-3247-42ae-ade1-84add3d42d4a.png)

现在, 你的服务已经在 worker名.用户名.workers.dev (就是点击部署时提示在以下位置可用的域名)上访问啦.


### 自定义域名访问(可选)

#### 设置路由
在刚刚创建的worker, 设置-->触发器里, 点击添加路由, 输入`自定义的域名/*` 如: `www.baidu.com/*` 然后点击添加.

#### 创建域名解析
到域名里的dns解析, 创建a记录, 地址随便填一个, `一定记得将代理状态开关打开,就是那朵云一定要是橙色的` 然后保存即可.

## todo
- [x] 自定义路径
- [ ] 增加覆盖自定义路径的选项
- [ ] 处理k-v限额已满的异常处理

## 感谢
 本项目脱胎于另一个同名项目[xyTom/Url-Shorten-Worker](https://github.com/xyTom/Url-Shorten-Worker) 感谢原作者！
