# Implementation Plan: Meet Module Refactoring (Based on PRD)

## 1. Core Flow Analysis
The PRD describes a "Store Conversion Flow" (到店转化流程), which is a specific mode of the "Meet" (相见) module triggered by scanning a store QR code.

**Flow:**
1.  **Scan QR Code** (Entry Point) -> `scene=store`, `shop_id`
2.  **Login Page** (If not logged in) -> Phone + Code -> Bind `shop_id`
3.  **Store Home Page** (Modified Home/Meet Page)
    *   Top: "You are at: [Store Name]"
    *   Modules: Meet Entry > Recommended Packages > Map/Nearby (Weakened)
4.  **Mandatory Relationship Selection Modal** (Force Popup)
    *   Condition: `scene=store` & First visit today
    *   Title: "Who are you eating with today?"
    *   Options: Bros, Besties, Couple/Ambiguous, First Date (Mandatory selection)
5.  **Relationship Scenario Page** (After selection)
    *   Top: Scenario Advice (e.g., for First Date: "Drink -> Dinner, 60-90 mins", Tags: #NoAwkward #Safe)
    *   Bottom: Package List (ID, Price, Suitable Relationship, Recommendation Reason)
6.  **Package Detail Page**
    *   Content, Price/FindMe Price, Tags, Rules
    *   Button: "Order Now"
7.  **Payment Page** -> WeChat Pay (Mock) -> Order/Verify Code
8.  **Success Page (Social Guide)**
    *   Order Info
    *   Social Card: "Want to see who else is eating nearby?"
    *   Buttons: See Nearby, Post Moment, Go to Map

## 2. Refactoring Tasks

### A. Navigation & Structure (Global)
*   **Requirement:** Add explicit "Back" buttons to all sub-pages.
*   **Requirement:** Clear page hierarchy.
*   **Action:**
    *   Ensure `Meet` is a main tab, but the *Store Flow* might be a separate overlay or a specific state within `Meet`.
    *   Implement a `StoreLayout` or `SubPageLayout` component with a standard Header (Back Button + Title).

### B. Page Implementation

#### 1. Store Entry Simulation (Dev Mode)
*   Since we can't scan QR codes, add a "Simulate Scan" button in the `Meet` tab or a debug menu to trigger the `store` mode with a mock `shop_id`.

#### 2. Store Home Page (`StoreHome.tsx`)
*   **Header:** "You are at: [Store Name]"
*   **Content:**
    *   "Meet" Entry (What is this? Maybe "Start a Meet Plan"?) -> *Clarification: PRD says "Meet Entry", likely meaning the flow to set up a meeting.*
    *   "Recommended Packages" List.
    *   "Nearby People" (Small/Collapsed).

#### 3. Relationship Selection Modal (`RelationshipModal.tsx`)
*   **Trigger:** On mount of Store Home if no relationship selected.
*   **UI:** Modal/Popup.
*   **Options:** 兄弟 (Bros), 闺蜜 (Besties), 情侣/暧昧 (Couple), 第一次见面 (First Date).
*   **Action:** On select -> Navigate to `ScenarioPage`.

#### 4. Scenario Page (`ScenarioPage.tsx`)
*   **Header:** Back Button + Title (e.g., "First Date Plan").
*   **Top Section (Advice):** Dynamic content based on selection.
    *   *First Date:* "Rec: Drink -> Dinner...", Tags.
*   **Bottom Section (Packages):** List of packages filtered by relationship.

#### 5. Package Detail Page (`PackageDetail.tsx`)
*   **Header:** Back Button.
*   **Content:** Details from mock data.
*   **Footer:** "Order Now" button.

#### 6. Payment & Success (`PaymentFlow.tsx`)
*   **Payment:** Mock loading -> Success.
*   **Success Page:**
    *   Order Code.
    *   **Social Call to Action:** "See who's nearby" -> Link to Map Tab.

## 3. Data Structure Updates
*   Need `Store` data (Name, ID).
*   Need `Package` data (linked to Store + Relationship).
*   Need `ScenarioAdvice` data (linked to Relationship).

## 4. Execution Steps
1.  **Setup Data:** Create `mockStoreData.ts` with stores, packages, and advice.
2.  **Create Components:** Build `StoreHeader`, `BackBtn`.
3.  **Implement Pages:**
    *   `StoreEntry` (Simulation)
    *   `RelationshipModal`
    *   `ScenarioPage`
    *   `PackageDetail`
    *   `PaymentSuccess`
4.  **Integrate:** Connect the flow in `Home.tsx` (or a new `StoreMode.tsx`).
5.  **Verify:** Test the full path: Scan -> Select -> Advice -> Package -> Order -> Social.
