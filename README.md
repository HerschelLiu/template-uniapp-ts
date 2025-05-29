**应用模板**
```bash
npx degit HerschelLiu/template-uniapp-ts#HEAD project
```bash
npm install
```

更新依赖到指定版本

```bash
# 更新到最新正式版
npm run uvm
```

```bash
# 上传微信小程序
# 不带参数，会有选项输入
npm run uploadToMP:dev

# 带参数 支持--key=value和--key value
# 直接使用参数，dev支持指定--msg
npm run uploadToMP:dev -- --msg="备注"

# prod支持指定--msg和--version version必填
npm run uploadToMP:prod -- --msg="备注" --version=版本号

# 除dev、prod外
run uploadToMP:指令 -- --msg "备注" --version 版本号 --robot 3-30
```

查看详细构建报告： `npx vite-bundle-visualizer`


使用了`unplugin-auto-import`自动导入插件，无需手动import
