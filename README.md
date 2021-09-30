# wxEditor

> wxEditor是基于UEditor UTF8-PHP v1.4.3版，进行二次开发的（微信公众号编辑器也是UEditor二次开发的）一个，符合编辑发布文章 到 微信公众号上的在线图文编辑器。
>
> - [ ] 打造一个符合编辑发布文章 到 微信公众号 的在线图文编辑器！
>
>
> - [ ] 修改以前不足，提高用户体验，增添强大功能。



### 实例地址：

### <a target="_blank" href="https://muguilin.github.io/wxEditor/" >https://muguilin.github.io/wxEditor</a>



### 实例效果：

![image](https://raw.githubusercontent.com/MuGuiLin/wxEditor/master/muguilin/demo/2019-08-28_172238.jpg)
![image](https://raw.githubusercontent.com/MuGuiLin/wxEditor/master/muguilin/demo/2019-08-28_172332.jpg)
![image](https://raw.githubusercontent.com/MuGuiLin/wxEditor/master/muguilin/demo/2019-08-28_172500.jpg)
![image](https://raw.githubusercontent.com/MuGuiLin/wxEditor/master/muguilin/demo/2019-08-28_172927.jpg)
![image](https://raw.githubusercontent.com/MuGuiLin/wxEditor/master/muguilin/demo/2019-08-28_174538.jpg)



### 修改功能：

1. 工具栏的icon样式和布局调整（按照之前微信公众号文章编辑器修改的）。

2. 支持公众号文章链接判断（且必须以 http:// 或 https:// 开头）。

3. 增加更多可选表情。

4. QQ音乐在线搜索。

5. 更多颜色可自定义调选。

   

### 增加功能：

1. 嵌入秀米助手。
2. 从外部复制图文时，将图片自动下载（除防盗链）到本地，和下载失败检测。
3. 从正文中提取图片、以及图片裁切。
4. 小程序入口。
5. 文字两端缩进。
6. 文字字间距设置。



### 使用说明：

主要是根目录中的muguilin文件夹中是二次开发的用到的素材文件、JS和CSS文件等。

- muditor.base.css // 样式

  - [ ] 自定义Alert弹窗

  - [ ] 小程序-弹窗

  - [ ] 从正文中提取图片弹窗

  - [ ] 从外部粘贴文本时 将图片下载在本地进度条弹窗

  - [ ] 图片预览放大弹窗

  - [ ] 图片裁剪弹窗

  - [ ] 公众号文章链接弹窗

    

- muditor.config.js // 配置和功能

  - [ ] QD__NET__  // 前端API域名常量，一般使用默认即可

  - [ ] HD__NET__ // 后端API域名常量，必需要和后端联调 （用于图裁切等,自定义上传功能，【除本地图片和本地视频上传以外的如：音频上传、图片裁切上传】）

  - [ ] Upload__Image__Url // 小程序图版上传常量

  - [ ] Upload__Cover__Url // 从正文中提取图片裁切上传常量

  - [ ] Upload__Music__Url // 本地音频道上传常量（原UEditor没有的）

  - [ ] **注：**以上关于上传相关的常量API，需要和后端联调，由后端提供，【接下来会逐步将这些API全部前端化，无需后端提供，敬请期待】。

  - [ ] 更多问题请发送邮件至：muguilin@foxmail.com
  
    

### 注意事项：

1. 代码要放在PHP服务环境（如：PhPStudy、WAMP等）下打开，部份功能才可以正常使用哦！
2. 使用[秀米助手](https://ent.xiumi.us/ue/)时，要求网站务必在使用https访问，下列代码中的引用的秀米网址也确保为https，否则会造成用户无法登录秀米账户。

