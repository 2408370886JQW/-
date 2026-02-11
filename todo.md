# Restoration Tasks

## Phase 1: Map Page & User Markers (Screenshots 1 & 2)
- [ ] **User Markers**:
    - [ ] Gender color coding: Blue for male, Pink for female (Check `Home.tsx` marker rendering)
    - [ ] Status dots: Green (Online), Yellow (Recent), Gray (Offline) (Check `Home.tsx` marker rendering)
    - [ ] Avatar border: 2px solid border matching gender color
    - [ ] Pulse effect for online users? (Check if needed based on static screenshot, likely yes for "Online")
- [ ] **Top Tab Bar**:
    - [ ] Layout: "偶遇", "好友", "动态", "相见" evenly distributed
    - [ ] Active state: Blue underline indicator, bold text
    - [ ] Subtitle: Small text below main label (e.g., "身边的人", "我的好友")
- [ ] **Bottom Navigation**:
    - [ ] Icons: Map, Circle (Users), Add (Plus), Message, Profile
    - [ ] Labels: "地图", "圈子", "发布动态", "消息", "我的"
    - [ ] Center "Add" button styling: Dark circle with white plus
- [ ] **Map Controls**:
    - [ ] Filter button (Funnel icon) position: Top right
    - [ ] Layer/Menu button (Chevron down) position: Below filter button
    - [ ] Location/Recenter button: Bottom left

## Phase 2: User Card & Filter Modal (Screenshots 3 & 4)
- [ ] **User Card (`3.png`)**:
    - [ ] Layout: Bottom sheet style
    - [ ] Content: Avatar (left), Name & Status (right), Tags (Zodiac, Hobby, etc.)
    - [ ] Buttons: "打招呼" (Dark), "查看主页" (Light)
    - [ ] Close interaction: Drag down or click outside
- [ ] **Filter Modal (`4.png`)**:
    - [ ] **Gender**: "全部", "男生" (Blue icon), "女生" (Pink icon)
    - [ ] **Age**: "18-22", "23-26", "27-35", "35+"
    - [ ] **Zodiac**: 12 signs grid (Aries to Pisces)
    - [ ] "Confirm" button: Full width, dark background

## Phase 3: Moments Page (`5.png`)
- [ ] **Layout**:
    - [ ] Waterfall/Masonry layout (2 columns)
    - [ ] Card style: Rounded corners, white background, shadow
- [ ] **Card Content**:
    - [ ] Image: Cover aspect ratio
    - [ ] User info: Avatar + Name (bottom left)
    - [ ] Stats: Heart icon + Like count (bottom right)
    - [ ] Overlay: Gradient at bottom for text readability? (Check screenshot)

## Phase 4: Meet Page (`7.png`)
- [ ] **Scenario Grid**:
    - [ ] 2 columns grid
    - [ ] Items: "约会", "闺蜜", "兄弟", "生日", "商务", "坐坐"
    - [ ] Styling: Icon + Label + "点击进入" text
    - [ ] Colors: Specific color coding for each scenario icon/bg
- [ ] **Header**:
    - [ ] Title: "选择相见场景"
    - [ ] Subtitle: "选择一个场景，开启你的社交之旅"

## Phase 5: Final Check
- [ ] Walkthrough all pages and compare with screenshots side-by-side
