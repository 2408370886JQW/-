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

## 彻底删除模拟扫码功能
- [x] 删除模拟扫码按钮和入口
- [x] 删除模拟扫码页面和中间流程
- [x] 删除所有扫码相关的state和handler
- [x] 确保不再出现"模拟扫码"相关文字
- [x] 扫码后直接进入商家详情页（由外部扫码触发）

## 相见页布局修复
- [x] 移除底部「发布动态」按钮与「不选关系」按钮的重叠问题
- [x] 「不选关系」按钮上移，与「发布动态」保持明显安全间距
- [x] 返回按钮改为 fixed 悬浮样式，始终固定在页面顶部

## 筛选区域新增「清除筛选」按钮
- [x] 在筛选项区域新增「清除筛选」按钮
- [x] 点击后一键清空所有已选筛选条件，恢复默认未筛选状态
- [x] 清除后立即刷新列表结果
- [x] 按钮视觉明显可发现，位置与筛选项逻辑一致

## 修复清除筛选按钮不可见问题
- [x] 调查清除筛选按钮为何不显示
- [x] 修复按钮使其始终可见（不仅在选中非默认分类时）

## 地图首页筛选区域新增「清除筛选」按钮
- [x] 在地图首页性别/星座/年龄筛选区域同层级新增「清除筛选」按钮
- [x] 点击后重置所有筛选条件（性别、星座、年龄）为默认状态
- [x] 地图用户数据同步刷新
- [x] 视觉上为操作按钮，不混入筛选项或内容区域
- [x] 移除团购商家页面中错误位置的清除筛选按钮

## 地图筛选新增距离维度
- [x] 新增距离筛选状态（distanceFilter）
- [x] 在筛选弹窗中新增距离筛选UI（500m、1km、3km、5km）
- [x] 距离筛选逻辑集成到地图标记过滤中
- [x] 清除筛选按钮同时重置距离筛选

## 相见页关系选择模块UI重构（参考Hinge探索页风格）
- [x] 搜索并下载关系主题高质量图片（情侣/闺蜜/兄弟/朋友/商务/合家欢等）
- [x] 上传图片到S3获取CDN URL
- [x] 重构关系选择为大图卡片布局（色彩叠加+底部粗体白字+圆角+人数角标）
- [x] 顶部大卡片+下方双列网格布局，匹配参考图风格
- [x] 保留「暂不选择关系」兜底入口
- [x] 确保选中态/未选中态视觉区分明确

## 相见页关系选择模块二次重构
- [x] 首推关系改为「初次见面」，放在第一个位置（大横向长方形卡片）
- [x] 关系顺序调整为：初次见面→情侣约会→闺蜜聚会→兄弟小聚→独处时光
- [x] 删除：生日派对、阖家团圆、商务宴请
- [x] 首推卡片为大横向长方形，样式固定不参与混排
- [x] 其余关系卡片采用横竖混排布局（横向小长方形+竖向长方形交替）
- [x] 禁止所有模块统一为竖向长方形
- [x] 文案引导改为「选择一种今天见面的场景」或「选择一种适合你们关系的见面方式」
- [x] 引导文案放在「相见」标题旁边或下方
- [x] 所有卡片风格严格参考用户提供截图（配色/圆角/阴影/字体层级/间距）

## 相见页关系模块文案与布局优化
- [x] 为每种关系场景配置独立标题与说明文案（体现不同氛围）
- [x] 情侣约会/闺蜜聚会/兄弟小聚标题文字移至卡片左侧区域
- [x] 独处时光标题位置保持不变（居中或底部居中）
- [x] 「直接看团购套餐」由按钮改为独立卡片模块，与上方关系卡片风格统一
- [x] 保持整体配色/圆角/阴影/字体层级/间距节奏一致

## 初次见面首推卡片视觉增强
- [x] 为初次见面Hero卡片增加「推荐」角标（左上角或右上角醒目位置）
- [x] 为Hero卡片设计独特的渐变背景动效（增强视觉吸引力）

## 关系卡片微交互与Hero卡片增强
- [x] 为其余关系卡片增加按压缩放+阴影加深的微交互反馈
- [x] 为「推荐」角标增加动态文案轮播（「推荐」「热门」「新手推荐」交替显示）
- [x] 在Hero卡片底部增加社交证明文案（如「已有23人正在使用」）
