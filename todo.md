# Todo List

## Phase 11: 底部导航悬浮化与相见页路由调整
- [ ] 修改 BottomNav.tsx，将其样式改为悬浮式（Floating Dock）
- [ ] 调整 Layout.tsx，确保页面内容不被悬浮导航遮挡（或有意遮挡以实现沉浸感）
- [ ] 修改 App.tsx 路由，将 `/meet` 路由直接指向 `MerchantDetailPage` 组件
- [ ] 移除旧的 `MeetPage.tsx` 或将其作为备用
- [ ] 调整 `MerchantDetailPage.tsx`，移除返回按钮（因为现在是主 Tab 页），并适配底部悬浮导航的间距

## Phase 12: 最终样式微调与交付
- [ ] 检查所有页面在悬浮导航下的显示效果
- [ ] 确保地图页的全屏体验
- [ ] 最终测试
