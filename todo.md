# Fix Tasks (Layout & Interaction)

## Phase 1: Analyze & Fix Layout/Interaction Logic
- [ ] **Step 1 (Scenario Selection) Fixes**:
    - [ ] **Tab Bar Visibility**: Ensure Step 1 is rendered *within* the main layout (Tab Bar visible).
    - [ ] **Scan Card Positioning**:
        - [ ] Must be fixed at the bottom *above* the Tab Bar (approx bottom-24).
        - [ ] Must NOT block the last row of grid items (add sufficient padding-bottom to scroll container).
        - [ ] Background gradient should be subtle and not obscure content too much.
    - [ ] **Grid Layout**: Re-verify aspect ratio and spacing.

- [ ] **Step 2-6 (Flow) Fixes**:
    - [ ] **Full Screen Mode**: These steps should overlay the entire screen (z-index > Tab Bar), hiding the Tab Bar.
    - [ ] **Transitions**: Add smooth slide-in/fade-in animations for entering the flow.

- [ ] **Code Refactoring**:
    - [ ] Check `Home.tsx` to see how `MeetPage` is rendered.
    - [ ] If `MeetPage` handles its own full-screen state, ensure `z-index` is correct.
    - [ ] Adjust `MeetPage.tsx` to handle "Step 1 = Inline" vs "Step > 1 = Fullscreen Overlay".
