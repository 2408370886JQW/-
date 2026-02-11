# Restoration Tasks

## Phase 1: Implement Step 1: Scenario Selection (Screenshots 7 & 8)
- [ ] Create `MeetPage.tsx` structure with state machine (step 1-4).
- [ ] Implement Step 1 UI:
    - [ ] Header: "选择相见场景", "选择一个场景，开启你的社交之旅", Back button.
    - [ ] Grid: 7 scenarios (Date, Bestie, Bro, Birthday, Business, Hangout, LateNight).
    - [ ] "Bro" card selected state (blue border).
    - [ ] Bottom Card: "扫码进店", "开启扫码" button.

## Phase 2: Implement Step 2: Venue & Relation Selection (Screenshot 11)
- [ ] Implement Step 2 UI:
    - [ ] Header: Venue image background, "花田错·创意餐厅".
    - [ ] Title: "今天和谁相见".
    - [ ] Grid: 6 relations (FirstMeet, Couple, Bestie, Bro, Alone, Family).
    - [ ] Icons and colors matching screenshot 11.

## Phase 3: Implement Step 3: Payment Verification (Screenshot 22)
- [ ] Implement Step 3 UI:
    - [ ] Modal/Overlay style.
    - [ ] "订单金额 ¥198".
    - [ ] Face ID animation (blue scanning lines).
    - [ ] "正在验证面容 ID...".

## Phase 4: Implement Step 4: Success Page (Screenshots 33 & 44)
- [ ] Implement Step 4 UI:
    - [ ] Full screen success state.
    - [ ] Green checkmark icon "支付已完成".
    - [ ] QR Code card (white bg, shadow).
    - [ ] Verification code "8392 1029".
    - [ ] Bottom buttons: "去偶遇" (Dark), "打发你的等待时间" (Light).

## Phase 5: Final Integration & Verification
- [ ] Integrate `MeetPage` into `Home.tsx`.
- [ ] Verify flow: Step 1 -> Step 2 -> Step 3 -> Step 4.
- [ ] Ensure all styles match screenshots pixel-perfectly.
