# 上传对象

## requirejs引用
'helpers/uploader"

## 对象介绍

### 单文件上传
```
Uploader.SingletonImageView
```
只能上传单个图片文件，仅支持图片文件。


### 多文件上传
```javascript
Uploader.MultipleObjectsView
```
可上传多个文件。


## 事件定义

- upload:addedfile(file)
  添加文件后，可用于日志等

- upload:removedfile(file)
  定义文件被删除。

- upload:sending(file)
  文件开始上传，可用于锁定表单按钮等

- upload:processing(file)
  文件上传中

- upload:successful(file)
  文件上传成功

- upload:complete(file)
  文件上传动作完毕，无论成功与否

- upload:error(file)
  文件上传失败。


