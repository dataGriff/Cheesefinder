# Design Guidelines: Cheese Questionnaire SaaS Platform

## Design Approach

**Reference-Based Approach** drawing from modern SaaS leaders:
- **Typeform**: Engaging, conversational questionnaire experience
- **Notion**: Clean workspace with intuitive content creation
- **Stripe**: Professional dashboard with clear data hierarchy
- **Linear**: Modern, efficient admin interfaces

**Core Principle**: Create a professional SaaS platform with two distinct design modes - sophisticated admin tools for cheese companies and delightful, engaging questionnaire experiences for end customers.

---

## Typography System

**Font Stack**: Inter (primary), Playfair Display (optional accent for cheese company branding areas)

**Hierarchy**:
- Display (hero headlines): 48px/56px, weight 700
- H1 (page titles): 32px/40px, weight 600
- H2 (section headers): 24px/32px, weight 600
- H3 (card titles): 18px/24px, weight 600
- Body Large: 16px/24px, weight 400
- Body: 14px/20px, weight 400
- Caption: 12px/16px, weight 500

---

## Layout System

**Spacing Primitives**: Use Tailwind units: 1, 2, 4, 6, 8, 12, 16, 24 for consistency

**Container Strategy**:
- Admin dashboard: max-w-7xl with px-6
- Questionnaire builder: max-w-6xl
- Public questionnaires: max-w-2xl (focused, distraction-free)
- Marketing pages: Full-width sections with inner max-w-7xl

**Grid Patterns**:
- Dashboard cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Questionnaire builder: Two-column split (sidebar + canvas)
- Response analytics: Mixed grid with featured metrics (col-span-2)

---

## Component Library

### Admin Dashboard Components

**Navigation**:
- Sidebar navigation (w-64) with company logo, main nav items, footer with user profile
- Top bar for context-specific actions and breadcrumbs
- Mobile: Collapsible hamburger menu

**Dashboard Cards**:
- Elevated cards with p-6, subtle shadow
- Header with icon + title + action button
- Metrics displayed prominently (large numbers, 32px)
- Trend indicators with micro charts

**Data Tables**:
- Clean headers with sort indicators
- Row hover states for interactivity
- Pagination controls at bottom
- Inline actions (view, edit, delete icons)

### Questionnaire Builder

**Canvas Area**:
- Centered workspace (max-w-3xl)
- Drag-and-drop zones with dashed borders when empty
- Question cards with grab handles, settings icon, delete action
- Live preview mode toggle

**Question Types Panel**:
- Left sidebar with categorized question types
- Icon + label for each type
- Drag to add interaction pattern

**Question Card Design**:
- Clear question text input area
- Question type indicator badge
- Expandable settings panel for options, validation, logic
- Visual distinction between different question types

### Public Questionnaire Interface

**Progress Tracking**:
- Slim progress bar at top (h-1)
- Step indicator showing current/total questions
- Back/Next navigation buttons

**Question Display**:
- One question per screen for focus
- Large, readable question text (24px)
- Response options with generous touch targets (min-h-12)
- Smooth transitions between questions

**Form Controls**:
- Multiple choice: Large radio buttons/checkboxes with full-width labels
- Rating scales: Interactive star/emoji ratings (48px touch targets)
- Text inputs: Clean, borderless design with bottom border focus state
- Sliders: Thick track (h-2) with large thumb (w-6 h-6)

### Results & Recommendations

**Recommendation Cards**:
- Large cheese product imagery (aspect-ratio-square)
- Product name (H3) + brief description
- Match score badge (prominent, top-right corner)
- "Learn More" CTA button

**Results Summary**:
- Visual preference map/chart
- Personalized intro text based on responses
- Share results option (social media icons)

---

## Marketing/Landing Pages

**Hero Section** (80vh):
- Large hero image showcasing artisan cheese or happy customers using the platform
- Centered headline + subheadline + dual CTAs (Sign Up + Watch Demo)
- Floating elements with backdrop-blur for buttons over imagery

**Feature Sections**:
- Alternating two-column layouts (image + text)
- Feature cards in 3-column grid showcasing platform capabilities
- Screenshots/mockups of actual interface in context

**Social Proof**:
- Customer logos grid (6-8 logos, grayscale with hover color)
- Featured testimonial cards (2-column on desktop)
- Case study preview cards with metrics

**Pricing Section**:
- 3-tier comparison table
- Highlighted "Popular" plan
- Feature comparison rows with checkmarks

**Footer**:
- Multi-column layout (Company, Product, Resources, Legal, Newsletter)
- Social media links
- Trust badges

---

## Images

**Required Images**:
1. **Hero Image**: Artisan cheese board or cheese professional using tablet/computer - warm, inviting, professional (full-width background)
2. **Feature Screenshots**: Dashboard interface, questionnaire builder, example public questionnaire on mobile
3. **Cheese Product Images**: Throughout public questionnaires and recommendation results (square aspect ratio)
4. **Customer Testimonial Photos**: Headshots of cheese company owners/managers (circular crop, 64px)
5. **Case Study Images**: Before/after analytics dashboards, success story visuals

**Image Treatment**:
- Hero: Subtle overlay (opacity-40) for text readability
- Product images: Crisp, professional photography with consistent lighting
- UI Screenshots: Clean, realistic mockups with actual interface content
- Avoid generic stock photos - prefer authentic, cheese-industry specific imagery

---

## Responsive Behavior

**Breakpoints**:
- Mobile-first approach
- sm: 640px (tablets)
- md: 768px (small laptops)
- lg: 1024px (desktops)

**Key Adaptations**:
- Admin sidebar collapses to hamburger on mobile
- Dashboard cards stack to single column on mobile
- Questionnaire builder switches to tabbed interface on mobile
- Public questionnaires optimized for thumb-friendly mobile interaction
- Data tables scroll horizontally on mobile with sticky first column

---

## Interaction Patterns

**Micro-interactions** (minimal, purposeful only):
- Form field focus states (subtle scale + border transition)
- Button hover states (slight brightness shift)
- Card hover elevation change
- Loading states (skeleton screens for data tables)
- Success confirmations (subtle slide-in toast notifications)

**Drag-and-Drop**:
- Visual feedback during drag (lifted shadow, slight rotation)
- Clear drop zones with border emphasis
- Smooth reordering animations