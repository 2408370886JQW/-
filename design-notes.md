# Design Notes from Reference Images (Hinge Explore Page Style)

## Key Design Patterns Observed:

### Card Structure:
- **Top hero card**: Full-width, tall (~60% of viewport), rounded-2xl corners
- **Grid cards below**: 2-column grid, each card ~square or slightly taller
- Cards are grouped by sections with section headers (bold title + subtitle)

### Color Overlays:
- Each card has a strong monochromatic color overlay on the photo
- Colors observed: warm orange/terracotta, deep purple, olive/yellow-green, dark green, deep red/crimson, golden yellow, teal/emerald
- The overlay is semi-transparent, allowing the photo to show through but with strong color tinting

### Typography:
- Bold white text at bottom-left of each card
- Large font size (~20-24px for grid cards, ~28-32px for hero card)
- Font weight: extra bold / black
- Text sits directly on the color overlay with no background box

### Person Count Badge:
- Small rounded pill badge at top-right of each card
- Contains a person icon + number (e.g., "23", "12", "7")
- Dark semi-transparent background with white text
- Small size, doesn't dominate

### Section Headers:
- Between card groups: bold title + lighter subtitle below
- e.g., "目标明确的约会" / "寻找相似的交往目标"
- e.g., "共同兴趣或爱好" / "寻找兴趣相投的人"

### Layout:
- Page title "探索" at very top, large bold
- Scrollable vertically
- No category tabs - pure visual browsing
- Background: white/light gray
- Cards have ~12-16px gap between them
- ~16px horizontal padding

### Color Palette for Overlays (mapped to our relations):
1. 情侣约会 → warm orange/terracotta (#C84B31 or similar)
2. 闺蜜聚会 → olive/yellow-green (#8B8B00 or similar)
3. 兄弟小聚 → deep green (#1B5E20 or similar)
4. 初次见面 → teal/emerald (#00695C or similar)
5. 商务宴请 → deep purple (#4A148C or similar)
6. 阖家团圆 → golden yellow (#F9A825 or similar)
7. 生日派对 → deep crimson (#880E4F or similar)
8. 独处时光 → dark green/teal (#004D40 or similar)
