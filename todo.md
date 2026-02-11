# Refactoring Tasks (Layout Hierarchy)

## Phase 1: Refactor Layout Hierarchy & Fix Occlusion
- [ ] **Fix Tab Bar Visibility (Step 1)**:
    - [ ] Modify `Home.tsx`: Ensure `MeetPage` container for Step 1 is rendered *inside* the main content area (z-index < Tab Bar).
    - [ ] Currently `MeetPage` container has `z-20` and `absolute inset-0`. Check if Tab Bar in `Layout.tsx` has higher z-index.
    - [ ] If `MeetPage` handles its own full-screen logic for Step 2+, `Home.tsx` should pass the `step` state or `MeetPage` should portal Step 2+ to body.
    - [ ] **Simpler Approach**: Keep `MeetPage` inside `Home` layout. Only Step 2+ components use `fixed inset-0 z-[100]` to cover everything. Step 1 component uses `relative` or `absolute` but respects Tab Bar.

- [ ] **Fix Scan Card Occlusion (Step 1)**:
    - [ ] In `MeetPage.tsx` (Step 1):
        - [ ] Increase `pb-64` to `pb-80` or more for the scroll container.
        - [ ] Ensure the Scan Card container has `pointer-events-none` for the transparent gradient part, and `pointer-events-auto` for the card itself (if needed, but better to just position it).
        - [ ] Verify `bottom-0` positioning relative to the viewport vs container.

- [ ] **Visual Tweaks**:
    - [ ] Re-verify grid aspect ratios.
    - [ ] Ensure "Scan Card" looks exactly like the video (floating above content, but below Tab Bar if Tab Bar is visible? No, video shows Scan Card is *above* content list, but Tab Bar is *below* Scan Card? Wait, in video Step 1 has Tab Bar. Scan Card is at bottom of page content. Tab Bar is at bottom of screen. So Scan Card should be `bottom-[tab_bar_height + spacing]`).
    - [ ] **Correction**: The Scan Card is likely *part of the scrollable content* or fixed *above* the Tab Bar. In the screenshot `IMG_2073.PNG`, the Scan Card is at the bottom, and there is a "+" button and Tab Bar below it. So Scan Card should be fixed at `bottom-24` (approx) or just above Tab Bar.

- [ ] **Action Plan**:
    1.  Read `Layout.tsx` to check Tab Bar z-index and height.
    2.  Modify `MeetPage.tsx`:
        -   Step 1: Remove `fixed/absolute` overlay if it blocks Tab Bar.
        -   Step 1 Scan Card: Position it `fixed bottom-24` (adjust for Tab Bar) or `sticky bottom-0`.
        -   Step 2+: Keep `fixed inset-0 z-[100]` to cover everything.
