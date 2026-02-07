# 软件需求规格说明书 (SRS) - FIND ME 「相见」模块

**版本**: 1.0
**日期**: 2026-02-05
**作者**: Manus AI
**状态**: 终稿

---

## 1. 引言

### 1.1 目的
本文档旨在为 FIND ME 「相见」模块的开发提供详细的技术实现规范。基于《产品需求文档 (PRD) - FIND ME 「相见」模块》，本文档进一步明确了功能逻辑、数据结构、接口定义及非功能性需求，作为开发、测试和验收的依据。

### 1.2 范围
本模块涵盖从用户扫码进入门店，到选择社交关系、查看场景建议、购买套餐，直至支付成功并引导社交的完整流程。

---

## 2. 总体描述

### 2.1 产品视角
「相见」模块是 FIND ME App 的核心线下转化组件，通过 LBS 和二维码技术连接线上用户与线下门店，构建“社交+消费”的闭环。

### 2.2 用户角色
- **普通用户**：扫码进店，选择关系，购买套餐，进行社交互动。
- **商家（后台）**：配置套餐、场景建议及关联关系标签。

---

## 3. 功能需求

### 3.1 扫码与登录 (Scan & Login)
**功能 ID**: FE-MEET-001
**描述**: 处理用户扫码后的身份识别与登录流程。
**输入**: 
- 二维码参数 `scene_id` (门店ID)
- 用户手机号、验证码 (若未登录)
**处理逻辑**:
1. 解析二维码获取 `store_id`。
2. 检查本地 Token 是否有效。
3. 若无效，跳转登录页；登录成功后自动重定向回扫码后的目标页。
**输出**: 跳转至门店首页。

### 3.2 关系选择 (Relationship Selection)
**功能 ID**: FE-MEET-002
**描述**: 强制用户选择当前社交关系。
**输入**: 用户点击关系选项 (Couple, Friend, Family, Business)。
**处理逻辑**:
1. 页面加载时检查 `store_id` 是否有效。
2. 弹出全屏模态框 (Modal)，禁用背景点击关闭。
3. 用户点击选项后，将 `relation_type` 存入 SessionStorage。
**输出**: 跳转至场景建议页，URL 携带 `?relation=xxx`。

### 3.3 场景建议与套餐展示 (Scenario & Packages)
**功能 ID**: FE-MEET-003
**描述**: 根据关系类型展示对应的场景攻略和套餐。
**输入**: `store_id`, `relation_type`。
**处理逻辑**:
1. 调用 `GET /api/store/{id}/scenarios?relation={type}` 获取场景攻略。
2. 调用 `GET /api/store/{id}/packages?relation={type}` 获取推荐套餐。
3. 前端根据返回数据渲染攻略卡片和套餐列表。
**输出**: 渲染场景建议页。

### 3.4 订单创建与支付 (Order & Payment)
**功能 ID**: FE-MEET-004
**描述**: 处理套餐下单与支付流程。
**输入**: `package_id`, `quantity`。
**处理逻辑**:
1. 用户点击“立即下单”，调用 `POST /api/orders` 创建订单。
2. 调起支付网关 (模拟环境直接返回成功)。
3. 支付成功回调中，更新订单状态为 `PAID`。
**输出**: 跳转至支付成功页。

### 3.5 支付成功与社交引导 (Success & Social)
**功能 ID**: FE-MEET-005
**描述**: 展示核销码并引导社交。
**输入**: `order_id`。
**处理逻辑**:
1. 展示订单核销码 (QR Code / Numeric)。
2. 展示“看附近的人”引导卡片。
3. 点击引导按钮，跳转至 LBS 社交模块。
**输出**: 渲染支付成功页。

---

## 4. 数据接口规范 (API Specs)

### 4.1 获取门店信息
- **Endpoint**: `GET /api/stores/:id`
- **Response**:
  ```json
  {
    "id": "store_001",
    "name": "花田错·下午茶",
    "address": "天山区新华北路108号",
    "cover_image": "url..."
  }
  ```

### 4.2 获取场景与套餐
- **Endpoint**: `GET /api/stores/:id/recommendations`
- **Query**: `relation_type` (enum: couple, friend, family, business)
- **Response**:
  ```json
  {
    "scenario": {
      "title": "第一次见面",
      "tags": ["2小时", "破冰"],
      "tips": "建议选择靠窗位置..."
    },
    "packages": [
      {
        "id": "pkg_101",
        "name": "初见双人餐",
        "price": 12800,
        "original_price": 16800,
        "image": "url..."
      }
    ]
  }
  ```

### 4.3 创建订单
- **Endpoint**: `POST /api/orders`
- **Body**:
  ```json
  {
    "store_id": "store_001",
    "package_id": "pkg_101",
    "relation_type": "couple"
  }
  ```
- **Response**:
  ```json
  {
    "order_id": "ord_20260205001",
    "status": "PENDING_PAYMENT"
  }
  ```

---

## 5. 非功能性需求

### 5.1 性能需求
- **页面加载时间**: 首屏加载时间 (FCP) 不超过 1.5秒。
- **接口响应时间**: 核心业务接口 (如创建订单) 响应时间不超过 500ms。

### 5.2 安全需求
- **身份验证**: 所有写操作接口需校验 JWT Token。
- **支付安全**: 支付金额需在后端二次校验，严禁前端直接传递金额。

### 5.3 兼容性需求
- **移动端适配**: 兼容 iOS 14+ 及 Android 10+ 主流浏览器及 WebView。
- **屏幕适配**: 完美适配 iPhone SE 至 iPhone 15 Pro Max 等各种屏幕尺寸。

---

## 6. 附录
- **PRD 文档**: [PRD_Meet_Module.md](./PRD_Meet_Module.md)
- **UI 截图**: [meet_module_design_export_v3.zip](./meet_module_design_export_v3.zip)
