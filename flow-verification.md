# MeetPage Flow Verification

## Step Flow Map

| Step | Page Name | Entry From | Next Step | Back To | Status |
|------|-----------|------------|-----------|---------|--------|
| 1 | Scan Entry Page | Tab click | 2 (via handleScan) | Home (encounter) | OK |
| 2 | Restaurant Detail + Package List | Step 1 scan | 3 (click package card) | Step 1 | OK |
| 2+ | Relation Overlay (on top of Step 2) | handleScan auto-shows | Dismiss → Step 2 clear | N/A | OK |
| 3 | Package Detail (full screen) | Step 2 card click | 4 (select package btn) | Step 2 | OK |
| 4 | Payment Page | Step 3 select | 5 (via isPaying effect) | Step 3 | OK |
| 5 | Success Page | Step 4 payment | 6 (view order) / encounter / moments | N/A | OK |
| 6 | Order Detail | Step 5 view order | Step 1 (close) | N/A | OK |

## Path A: Select Relation
1. Step 1: Click "模拟扫码进店" → handleScan() → setStep(2) + setShowRelationOverlay(true)
2. Step 2: Background is blurred, relation card appears
3. User clicks a relation (e.g., "情侣/暧昧") → handleSelectRelation() → setRelationTag('romantic') → overlay dismisses after 400ms
4. Step 2: Background clears, packages filtered by 'romantic' tag (shows: 初见双人轻食, 心动法式晚餐, 微醺下午茶)
5. User clicks a package card → setSelectedPackage(pkg) + setStep(3)
6. Step 3: Full screen package detail → click "选择此套餐" → setStep(4)
7. Step 4: Payment page with wechat/alipay toggle → click "确认支付" → setIsPaying(true)
8. isPaying effect fires → 2.5s delay → setStep(5) + confetti
9. Step 5: Success page with "查看订单", "开启偶遇雷达", "探索周边新鲜事"

## Path B: Skip Relation
1. Step 1: Click "模拟扫码进店" → handleScan() → setStep(2) + setShowRelationOverlay(true)
2. Step 2: Background is blurred, relation card appears
3. User clicks "跳过，直接看全部套餐" → handleSkipRelation() → setRelationTag(null) → overlay dismisses
4. Step 2: Background clears, ALL 5 packages shown (no filter)
5. Rest of flow identical to Path A

## Verification Checklist
- [x] Scan → enters ONE fixed restaurant (花田错·西餐厅) only
- [x] No multi-restaurant recommendation page
- [x] No city selection page
- [x] No map redirect
- [x] Relation overlay appears on scan with blurred background
- [x] Relation selection filters packages by tag
- [x] Skip button shows all packages
- [x] Package list page shows only cards (no large detail images)
- [x] Package detail page shows full-screen hero image, gallery, items, notes
- [x] Payment page has wechat/alipay toggle
- [x] Payment success page has "开启偶遇雷达" and "探索周边新鲜事" buttons
- [x] Order detail page shows dynamic data (package name, price, payment method, time)
- [x] All back buttons point to correct previous step
- [x] No dead links or blank pages
- [x] No duplicate step definitions
