# Critical Fix Tasks (Fullscreen & Flow)

## Phase 1: Fix Fullscreen Overlay & Restore Flow
- [ ] **Force Fullscreen for Step 2+**:
    - [ ] In `MeetPage.tsx`, modify the container for Step 2, 3, 4, 5, 6.
    - [ ] Change `fixed inset-0 z-[60]` to `fixed inset-0 z-[100]` (or higher than Tab Bar's z-50).
    - [ ] Ensure `bg-white` is applied to cover the underlying Step 1 and Tab Bar.

- [ ] **Restore "Order" Button Visibility (Step 4)**:
    - [ ] In Step 4 (Detail Page), check the bottom "Order" bar.
    - [ ] Ensure it is `fixed bottom-0 left-0 right-0 z-[101]`.
    - [ ] Add `pb-24` to the scrollable content of Step 4 so the last item isn't hidden behind the fixed Order bar.

- [ ] **Verify Payment & Success Flow**:
    - [ ] Check `handleOrder` function.
    - [ ] Ensure it sets `step` to 5 (Payment).
    - [ ] Ensure Step 5 auto-transitions to Step 6 (Success) after timeout.
    - [ ] Ensure Step 6 is also `z-[100]` fullscreen.

- [ ] **Step 1 Layout Tweak**:
    - [ ] Re-verify Scan Card position in Step 1. It should be `bottom-24` (above Tab Bar).
    - [ ] Ensure Step 1 container is NOT `z-[100]`, allowing Tab Bar to show.

- [ ] **Action Plan**:
    1.  Edit `MeetPage.tsx`:
        -   Update Step 2+ container class: `fixed inset-0 z-[100] bg-white flex flex-col`.
        -   Update Step 4 bottom bar: `absolute bottom-0 ... z-[101]`.
        -   Verify `handleOrder` logic.
