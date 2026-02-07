# 产品需求文档 (PRD) - FIND ME 「相见」模块

**版本**: 1.0
**日期**: 2026-02-05
**作者**: Manus AI
**状态**: 终稿

---

## 1. 文档概述

### 1.1 背景
FIND ME 致力于重构线下社交场景，打造“相见-到店-转化”的商业闭环。本模块旨在通过“相见”功能，引导用户从线上发现社交灵感，到线下扫码进入门店专属空间，最终完成基于社交关系的消费转化。

### 1.2 目标
- **用户侧**：解决“和谁去、去干嘛”的社交决策问题，提供定制化的场景建议和套餐。
- **商家侧**：通过强制关系选择，精准识别用户画像，提升客单价和转化率。
- **平台侧**：沉淀高价值的社交关系数据，构建基于 LBS 的社交网络。

---

## 2. 业务流程图 (User Flow)

```mermaid
graph TD
    A[首页-相见Tab] -->|点击| B[模拟扫码入口]
    B -->|扫码成功| C{是否已登录?}
    C -->|否| D[手机号登录/绑定]
    D -->|登录成功| E[门店首页]
    C -->|是| E
    E -->|自动弹出| F[关系选择弹窗]
    F -->|选择关系(如情侣)| G[场景建议页]
    G -->|选择套餐| H[套餐详情页]
    H -->|点击下单| I[支付模拟]
    I -->|支付成功| J[支付成功页]
    J -->|引导社交| K[查看附近的人]
```

---

## 3. 功能详情与页面交互

### 3.1 首页 - 相见 Tab
**功能描述**：
作为“相见”模块的线上入口，展示社交灵感和场景推荐。

**页面元素**：
- 顶部导航栏：切换“偶遇”、“好友”、“动态”、“相见”。
- 核心区域：展示“模拟扫码”入口（开发阶段用于测试）。

**交互逻辑**：
- 点击底部“相见”Tab，进入该页面。
- 点击“模拟扫码”按钮，触发扫码模拟流程。

**视觉参照**：
![Meet Tab](https://private-us-east-1.manuscdn.com/sessionFile/9ILyBCCLwj29E3N3tBGyix/sandbox/l8H5MJ73HyKwNcbSRmlKja-images_1770303144545_na1fn_L2hvbWUvdWJ1bnR1L3NvY2lhbC1saWZlLWFwcC9zY3JlZW5zaG90c19leHBvcnQvMF9NZWV0X1RhYg.png?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvOUlMeUJDQ0x3ajI5RTNOM3RCR3lpeC9zYW5kYm94L2w4SDVNSjczSHlLd05jYlNSbWxLamEtaW1hZ2VzXzE3NzAzMDMxNDQ1NDVfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwzTnZZMmxoYkMxc2FXWmxMV0Z3Y0M5elkzSmxaVzV6YUc5MGMxOWxlSEJ2Y25Rdk1GOU5aV1YwWDFSaFlnLnBuZyIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=gNPx6ycK9MJ8zhefcA7YskURBTUo8Utc~a3U-SPUbwqTLTqwQQG-8KQJqWFXwccCC2K~2kKnA7dl05UES~G~O4y5SsqnMmdpJmJj8UNgVEvgRiyHCsDtC8k~35Jo--OTKLpHML-WnT1T6FPDh750ogvkHPpu5Axfwcl~GA-R1JHEmkYSCtq-tPOi0YDzkBtaEqVH~WcIdK0E0Om5wQgmYmSIWXbQ161F-6O4i0Wx2oqnCJfypJyvxI231I~uMBGvpqI6H0g7EKE4rngoodhC4wkWMmfaK6229U2LOzAabGNVUoJsZ7fD3VGFBs5NlHfk6sKkK965U-Yu75etE5lS5Q__)

---

### 3.2 模拟扫码入口 (Store Entry)
**功能描述**：
模拟用户在线下门店扫描桌贴或台卡二维码的场景。

**页面元素**：
- 扫码图标：视觉中心，引导点击。
- 提示文案：“点击下方按钮模拟扫描桌贴/台卡二维码”。
- 操作按钮：“模拟扫码 (scene=store)”。

**交互逻辑**：
- 点击按钮后，系统判断用户登录状态。
- 若未登录，跳转至 [3.3 登录页]。
- 若已登录，跳转至 [3.4 门店首页]。

**视觉参照**：
![Store Entry](https://private-us-east-1.manuscdn.com/sessionFile/9ILyBCCLwj29E3N3tBGyix/sandbox/l8H5MJ73HyKwNcbSRmlKja-images_1770303144545_na1fn_L2hvbWUvdWJ1bnR1L3NvY2lhbC1saWZlLWFwcC9zY3JlZW5zaG90c19leHBvcnQvMV9TdG9yZV9FbnRyeQ.png?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvOUlMeUJDQ0x3ajI5RTNOM3RCR3lpeC9zYW5kYm94L2w4SDVNSjczSHlLd05jYlNSbWxLamEtaW1hZ2VzXzE3NzAzMDMxNDQ1NDVfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwzTnZZMmxoYkMxc2FXWmxMV0Z3Y0M5elkzSmxaVzV6YUc5MGMxOWxlSEJ2Y25Rdk1WOVRkRzl5WlY5RmJuUnllUS5wbmciLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=WzcbIXFNMdjSQfTSBulLpliWZ-Z~jFlxtNjWQFzAIK~YzF--yucjfPWvGw-CdBz9B0U-hPuDXSQTrpgIU~nE8t4d~8NSr-kpKfVwMCpEEmCCzs4VFODC-SMvTCcRAg8ksm4-My-VsoFEwmnKHW7P8RrmRuuZhB9NRSOnku26nNohyznnH4zZU2InSGvXZSrZ22kOQnPOz6-iJSSKZVUed1YG5~mKl2ZjcekgyU~SMjbS95cquu2cpCJL-j0AkvgMEDeD7VhXJ1EIIx6NUcZBnbcAd6e73od25EAzlAeLYpontp8qPaaeVhviGgOjOO3p2eNX~IqPE8qWIiwR7Ba9-g__)

---

### 3.3 登录/绑定页 (Login)
**功能描述**：
用户首次扫码时的身份验证与门店绑定。

**页面元素**：
- 欢迎语：“欢迎来到 [门店名称]”。
- 输入框：手机号、验证码。
- 按钮：“登录并绑定门店”。

**交互逻辑**：
- 输入手机号和验证码（模拟环境可任意输入）。
- 点击登录按钮，完成身份验证，跳转至 [3.4 门店首页]。

**视觉参照**：
![Login](https://private-us-east-1.manuscdn.com/sessionFile/9ILyBCCLwj29E3N3tBGyix/sandbox/l8H5MJ73HyKwNcbSRmlKja-images_1770303144545_na1fn_L2hvbWUvdWJ1bnR1L3NvY2lhbC1saWZlLWFwcC9zY3JlZW5zaG90c19leHBvcnQvMl9Mb2dpbg.png?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvOUlMeUJDQ0x3ajI5RTNOM3RCR3lpeC9zYW5kYm94L2w4SDVNSjczSHlLd05jYlNSbWxLamEtaW1hZ2VzXzE3NzAzMDMxNDQ1NDVfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwzTnZZMmxoYkMxc2FXWmxMV0Z3Y0M5elkzSmxaVzV6YUc5MGMxOWxlSEJ2Y25Rdk1sOU1iMmRwYmcucG5nIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=oC6rYblVCKN8SKRMk-Fkr9EbI9sN-QLTQ8iiBriydqsLh1uoAhdLrhfnfhl1ymD86PtenIMkP8p2XD5rTFWkQyTb29MD7h2L4ydgUiNnDvRyDOG~rVwGRmKr9qVhcx~BulM5n0p42g~KCVbXekWGtw-bIgF78lAVlzYo2vlvq9YMfq-ZvT5BS0Gzxicwu0P7njUwKe40fCn7XbjB4NZDaCPySdZeVC-Vka1LjIdPhGPXFGRL-QIM9KBoLK-JaV0ds98-cQ~hImechtOp1FkzJv~Cd9-QI2w9MZ2HeAIwx9SRPRBmdUSwcBWOdqiQOJ78z73FWOFeUGroNxhtb8SgzA__)

---

### 3.4 门店首页与关系选择 (Store Home & Relationship)
**功能描述**：
用户进入门店数字化空间，系统强制要求确认当前的社交关系。

**页面元素**：
- 门店信息卡片：店名、地址。
- **关系选择弹窗 (Modal)**：
    - 标题：“今天和谁来？”
    - 选项：情侣 (Couple)、朋友 (Friend)、家人 (Family)、商务 (Business)。
    - 样式：全屏遮罩或底部弹窗，不可关闭，强制选择。

**交互逻辑**：
- 进入页面后，自动弹出关系选择弹窗。
- 用户必须点击其中一个选项才能继续。
- 选择后，系统记录该关系标签，并跳转至对应的 [3.5 场景建议页]。

**视觉参照**：
![Relationship Modal](https://private-us-east-1.manuscdn.com/sessionFile/9ILyBCCLwj29E3N3tBGyix/sandbox/l8H5MJ73HyKwNcbSRmlKja-images_1770303144545_na1fn_L2hvbWUvdWJ1bnR1L3NvY2lhbC1saWZlLWFwcC9zY3JlZW5zaG90c19leHBvcnQvM19SZWxhdGlvbnNoaXBfTW9kYWw.png?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvOUlMeUJDQ0x3ajI5RTNOM3RCR3lpeC9zYW5kYm94L2w4SDVNSjczSHlLd05jYlNSbWxLamEtaW1hZ2VzXzE3NzAzMDMxNDQ1NDVfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwzTnZZMmxoYkMxc2FXWmxMV0Z3Y0M5elkzSmxaVzV6YUc5MGMxOWxlSEJ2Y25Rdk0xOVNaV3hoZEdsdmJuTm9hWEJmVFc5a1lXdy5wbmciLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=BwUAfvZNwWWBjK5~Hx2aU7KsnJwCXCeD5NiNgjReHSSSob3WcfE-AjVeHxGzXa3FBxRpZ0DsXCBlAgj0G6D9E-JlRk1k3qdueyrnNKV4gfXPUxPKlsFobi2TVOpPv7~36YpYuq354ZEo4RgUS~3mUUzSCZL9mytsnZMtUbjD63FeK392q50h9PS8-C4spIoHkvlDzCuI2mXL-B6axkczzgrgs5Tsozr0GoOjjzmwb7zf7M30EU0aZWH28-g6g6e9nXBcjWhxZKvrDIzZLTAkMr0HM3fE3UfwGxACALIvHg6ZmAMmAhjeLwmDQOvQsZYxkE28bADy0gJmoPxFStg6jg__)

---

### 3.5 场景建议页 (Scenario Advice)
**功能描述**：
基于用户选择的关系，提供定制化的社交建议和套餐推荐。

**页面元素**：
- **顶部导航**：返回按钮、标题（如“情侣 · 建议”）。
- **场景攻略卡片**：
    - 标题：“第一次见面” / “老夫老妻”等。
    - 标签：时长建议（如“2小时”）、流程（如“破冰-进餐-互动”）。
    - 描述：提供具体的话题建议或互动小贴士。
- **推荐套餐列表**：
    - 仅展示符合该关系的套餐。
    - 套餐卡片包含：图片、名称、价格、推荐理由（如“适合拍照”、“分量适中”）。

**交互逻辑**：
- 点击任意套餐卡片，跳转至 [3.6 套餐详情页]。
- 点击顶部返回按钮，返回上一级（门店首页，并重新弹出关系选择）。

**视觉参照**：
![Scenario Page](https://private-us-east-1.manuscdn.com/sessionFile/9ILyBCCLwj29E3N3tBGyix/sandbox/l8H5MJ73HyKwNcbSRmlKja-images_1770303144545_na1fn_L2hvbWUvdWJ1bnR1L3NvY2lhbC1saWZlLWFwcC9zY3JlZW5zaG90c19leHBvcnQvNF9TY2VuYXJpb19QYWdl.png?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvOUlMeUJDQ0x3ajI5RTNOM3RCR3lpeC9zYW5kYm94L2w4SDVNSjczSHlLd05jYlNSbWxLamEtaW1hZ2VzXzE3NzAzMDMxNDQ1NDVfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwzTnZZMmxoYkMxc2FXWmxMV0Z3Y0M5elkzSmxaVzV6YUc5MGMxOWxlSEJ2Y25Rdk5GOVRZMlZ1WVhKcGIxOVFZV2RsLnBuZyIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=JRMeT6PafuBigQOCWm3-L8CPvJATcV4N5sfutnPZXVYU~Dw~bG0v4yOga8iAyKCImpFyJhUhnpbWLtxOEFbfxXw8g1bUPq3otTw3F-OrZ7iDLyFqBjU5y4dTzKNbg9MvM7rWnrUz25ffiK1jKrd6mvEkEP9RWRby631reIKicuS-pRbu2iO9rVdND6hzhvyQbyv8anOIKUBW84xb7JWLAVwXnsDV0HF8LdpMcKeVGUmtk3FMtRqhloSO4NpSC1r9lGHFDZS5db6Th0As4a3Va1XZRnYO8i8KbySM5My00rgM5SEKT~msCtlffX9joSL7ojcEV2N7yj-oIf5lPJqZSw__)

---

### 3.6 套餐详情页 (Package Detail)
**功能描述**：
展示套餐的详细信息，促进下单转化。

**页面元素**：
- 顶部大图：沉浸式展示菜品或环境。
- 价格栏：现价（高亮）、原价（划线）、标签（“FIND ME 专享价”）。
- 详情内容：套餐包含菜品明细、使用规则（免预约、随时退）。
- 底部操作栏：总价显示、“立即下单”按钮。

**交互逻辑**：
- 点击“立即下单”，触发支付模拟流程（Loading 状态）。
- 支付成功后，自动跳转至 [3.7 支付成功页]。

**视觉参照**：
![Package Detail](https://private-us-east-1.manuscdn.com/sessionFile/9ILyBCCLwj29E3N3tBGyix/sandbox/l8H5MJ73HyKwNcbSRmlKja-images_1770303144545_na1fn_L2hvbWUvdWJ1bnR1L3NvY2lhbC1saWZlLWFwcC9zY3JlZW5zaG90c19leHBvcnQvNV9QYWNrYWdlX0RldGFpbA.png?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvOUlMeUJDQ0x3ajI5RTNOM3RCR3lpeC9zYW5kYm94L2w4SDVNSjczSHlLd05jYlNSbWxLamEtaW1hZ2VzXzE3NzAzMDMxNDQ1NDVfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwzTnZZMmxoYkMxc2FXWmxMV0Z3Y0M5elkzSmxaVzV6YUc5MGMxOWxlSEJ2Y25Rdk5WOVFZV05yWVdkbFgwUmxkR0ZwYkEucG5nIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=QCQdYdt9tNn3j5Y0q8i3ufmJO~Fob7WaU7rH0S9B159LcsId~ku6yanj3meRjkS3GZJfr9sHJFBo~M1ftl0dNOFZ5H1lVrDiQQCwo0v0lEfIWECzJlbXbCJsTMxJVoY5DKw2yWnV6M4NEbJSSVqFq2g1PFyucFhXKofCELl7cGIbqFaLkbI2V9zQKTkVD6tGq3rcoD~xFA5TgzBmQCcDx4zLVXt1RxoWkemJoWHKZnRug-wBQzf-6KAbdpQFe-SJqIFm5DHwkn-lMvlDZU3cJcRITKD5JIzKyhx5BTIGWy3u5~nMhXQDDFo2TZW1EB1cDsioWaC6YGZ~TfOJ~cuBog__)

---

### 3.7 支付成功与社交引导 (Success & Social)
**功能描述**：
支付完成后的反馈，并利用 LBS 引导用户进行社交连接。

**页面元素**：
- 状态反馈：大大的绿色对勾，“支付成功”。
- 核销码：显示 8 位数字核销码。
- **社交引导卡片**：
    - 文案：“要不要看看... 现在也在附近吃饭的人？”
    - 按钮：“看附近的人”（主操作）、“发相见动态”（次操作）。
- 底部按钮：“返回首页”。

**交互逻辑**：
- 点击“看附近的人”，跳转至地图页或附近的人列表（本期暂未实现，可链接至首页地图 Tab）。
- 点击“返回首页”，回到 App 首页。

**视觉参照**：
![Success Page](https://private-us-east-1.manuscdn.com/sessionFile/9ILyBCCLwj29E3N3tBGyix/sandbox/l8H5MJ73HyKwNcbSRmlKja-images_1770303144545_na1fn_L2hvbWUvdWJ1bnR1L3NvY2lhbC1saWZlLWFwcC9zY3JlZW5zaG90c19leHBvcnQvNl9TdWNjZXNzX1BhZ2U.png?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvOUlMeUJDQ0x3ajI5RTNOM3RCR3lpeC9zYW5kYm94L2w4SDVNSjczSHlLd05jYlNSbWxLamEtaW1hZ2VzXzE3NzAzMDMxNDQ1NDVfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwzTnZZMmxoYkMxc2FXWmxMV0Z3Y0M5elkzSmxaVzV6YUc5MGMxOWxlSEJ2Y25Rdk5sOVRkV05qWlhOelgxQmhaMlUucG5nIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=IULPEXnwdfHx78S4Jag3DeLzBvlVh9~yIj-enke6MFvi6uISyCduBfXz038vl6igvba40wi8LCNj0GrfmVT5lS0elTyd4At8YYjUMEtbdgBY2yZYvr1esoTTL~zifKVPIcM2PsOlgpIEJX0HAm-o-ZjW1kHRRbZmnIRt12zhIV5K8D-VsR8MkqgwpvWCjJjo3Np8gAihTe2fRy8bMD~jIoId0n7v4p3PoYnTkBHZdJBxF9lBbkVIftSXwmvexPMDA0IickAadbpZXP3v0QSPh~~NQu0k9jV~Vaur8Fl4HqNu~gxbnS~uXrPbRvvmOINC-6dugVg3UqYLItpFa3EVEQ__)

---

## 4. 数据埋点需求

| 页面 | 事件 | 参数 | 说明 |
| :--- | :--- | :--- | :--- |
| 模拟扫码页 | click_scan | scene_id | 统计扫码入口流量 |
| 关系弹窗 | select_relationship | relation_type (couple/friend/etc) | 核心数据：用户社交关系分布 |
| 场景建议页 | view_scenario | relation_type | 统计场景攻略的曝光率 |
| 套餐详情页 | click_order | package_id, price | 统计下单意向 |
| 支付成功页 | click_social_nearby | - | 统计支付后的社交转化率 |

---

## 5. 附录
- **截图资源包**：[meet_module_design_export_v3.zip](./meet_module_design_export_v3.zip)
- **原型地址**：[部署链接]
