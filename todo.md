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
