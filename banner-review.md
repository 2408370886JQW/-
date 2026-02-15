# Restaurant List Page Banner Review

## Current State
- The page shows "推荐商家" header with "初次见面 · 为你精选" subtitle
- Below the header is the "初次见面小贴士" advice card (pink border)
- Then a transition text: "因为你选了「初次见面」，为你推荐以下商家"
- Restaurant cards follow below

## Missing: Smart Recommendation Banner
- The orange gradient "基于你选择的场景智能推荐" banner should appear between the header and the advice card
- Need to check if the banner code was inserted correctly
- The banner with Sparkles icon + "基于你选择的场景智能推荐" + "已为「初次见面」匹配最合适的商家与套餐" should be visible

## Issue
- The banner IS in the code (lines 824-848) but may not be rendering visibly
- Need to scroll up or check if it's hidden behind the sticky header
