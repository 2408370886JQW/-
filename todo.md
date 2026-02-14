# Project TODO

## Completed
- [x] Basic app structure with Home, Map, Meet, Circle pages
- [x] iOS liquid glass visual style
- [x] MeetPage multi-step flow (relation → restaurant → detail → payment → success)
- [x] Payment method switching (WeChat/Alipay)
- [x] Haptic feedback and scale animations

## Current Issues to Fix
- [x] Split package page into Package List (browse multiple packages) and Package Detail (single package full-screen view)
- [x] Ensure Package List page shows only cards, no large detail images
- [x] Ensure Package Detail page shows full-screen detail for a single selected package
- [x] Fix flow: Package List → Package Detail → Payment
- [x] Restore post-payment navigation buttons (Go to Encounter + View Nearby Moments)
- [x] Verify complete flow: Select Package → Payment → Success → Navigation buttons

## Scan Flow Refactoring
- [x] Scan = already in-store, skip multi-restaurant list
- [x] Scan → blurred restaurant background + relation selection card overlay
- [x] Path A: select relation → filter packages by relation → package list
- [x] Path B: skip relation → show all packages directly
- [x] After relation selection, card disappears, background becomes clear
- [x] No multi-restaurant recommendation after scan
- [x] Complete flow: Scan → Restaurant Detail + Packages → Select Package → Payment → Success

## Dual Flow Refactoring (Online + Offline)
- [x] Online flow: 相见 entry → select relation page → multi-restaurant list → select restaurant → package list → package detail → payment → social guide
- [x] Offline flow: scan button → single fixed restaurant → relation overlay → filtered packages → package detail → payment → social guide
- [x] Two flows must be completely independent, no mixing
- [x] Online flow must show multiple restaurants (not just one)
- [x] Offline flow must lock to single restaurant (no multi-restaurant list)
- [x] Both flows end with social/encounter navigation buttons
- [x] Verify both flows run to completion independently

## Scan Flow Dual-Path Refactoring (Relation Packages vs Normal Packages)
- [x] Scan → go directly to restaurant detail page (no relation overlay)
- [x] Restaurant detail page has two clear entry points: select relation / skip
- [x] Path A: select relation → relation-specific package list (separate data)
- [x] Path B: skip → normal group-buy package list (双人餐/三人餐/四人餐, no relation tags)
- [x] Relation packages and normal packages are completely separate data structures
- [x] Relation packages and normal packages are on different pages, never mixed
- [x] No multi-restaurant recommendation after scan
- [x] No second scan page after scan
- [x] Verify Path A: scan → restaurant → select relation → relation packages → order
- [x] Verify Path B: scan → restaurant → skip → normal packages → order

## 相见页关系选择逻辑优化
- [x] 在线流程关系选择页新增「暂不选择关系」选项
- [x] 选择「暂不选择关系」后直接进入纯团购套餐选商家页面
- [x] 纯团购页面只展示吃/喝/玩相关商家与套餐，不基于关系推荐

## 支付成功页返回逻辑优化
- [x] 支付成功页增加【返回上一页】按钮
- [x] 查看订单后返回支付成功页，而非跳转到地图首页
- [x] 整体返回路径：支付成功页 → 上一业务页 → 而非强制回首页

## 纯团购商家列表页分类筛选
- [x] 为纯团购商家列表页增加分类筛选标签（全部、美食、饮品、娱乐等）
- [x] 商家数据增加 category 字段
- [x] 筛选标签切换时过滤商家列表，无切换提示

## 修复相见页「暂不选择关系」按钮不可见问题
- [x] 确保「暂不选择关系」按钮在相见页关系选择区域明确可见
- [x] 点击后进入纯团购商家列表页（路径B）
- [x] 两条路径（选关系/不选关系）并行清晰

## 相见页入口精简优化
- [x] 删除顶部「选择关系」和「不选关系」两个入口卡片
- [x] 保留关系标签网格作为主路径
- [x] 底部保留并强化「暂不选择关系，直接查看团购套餐」按钮作为兆底路径

## 关系建议卡片（Advice Card）模块
- [x] 为每种关系类型创建建议数据（见面建议/场景建议/氛围建议）- [x] 在选择关系后的商家推荐列表上方新增关系建议UI片UI
- [x] 所有关系页面统一套用该结构
- [x] 确保视觉层级：建议卡片在商家列表之上
- [x] 不改变原有推荐商家逻辑
