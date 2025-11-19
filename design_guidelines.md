# NovyxDev Website Design Guidelines

## Design Approach
**Reference-Based Approach**: Modern SaaS-style landing page inspired by professional web development agencies, focusing on showcasing portfolio work and services with clean, professional aesthetics.

## Core Design Principles
- **Language**: All UI text must be in Hungarian
- **Color Palette**: Blue and white only - various shades of blue paired with white, using solid colors exclusively (NO gradients)
- **Visual Style**: Clean, modern SaaS aesthetic with professional polish
- **Typography**: Poppins font family (or similar modern sans-serif) used consistently throughout

## Typography System
- **Headings**: Poppins Bold/SemiBold for section titles and hero headlines
- **Body Text**: Poppins Regular for descriptions and content
- **Size Hierarchy**: Large hero titles, medium section headers, standard body text
- **All text content rendered in Hungarian language**

## Layout & Spacing
- **Spacing Units**: Tailwind units of 4, 6, 8, 12, 16, 20 for consistent rhythm
- **Section Padding**: py-16 to py-24 for desktop sections, py-12 for mobile
- **Container Max-Width**: max-w-7xl for content sections
- **Card Spacing**: gap-6 to gap-8 between grid items

## Component Library

### Navigation
- Fixed navbar with NovyxDev logo left, menu items right
- Hungarian menu labels: "Főoldal", "Referenciák", "Szolgáltatásaink", "Rólunk", "Kapcsolat"
- Mobile: Hamburger menu for responsive breakpoints
- Smooth scroll behavior to sections

### Hero Section
- Large, bold Hungarian headline: "Professzionális weboldalak a NovyxDev-től"
- Supporting subtitle describing custom website development
- Dual CTA buttons: "Referenciáink megtekintése", "Ajánlatkérés"
- **Hero Image**: Mockup images or preview visuals showcasing website examples
- Buttons over images use blurred backgrounds for readability

### References Section
- Grid layout (3-4 columns desktop, responsive to 1 column mobile)
- Filterable cards by category and tech stack
- Card elements: Project name, category badge, short description, tech stack tags, preview image, star rating (1-5)
- Click interaction opens modal with: larger images, detailed description, feature list, client name, rating, client quote
- Filter UI above grid for "Mind", "Vállalati", "Webshop", tech filters

### Services Section
- Service cards in grid (2x2 or 4-column layout)
- Four categories: "Egyedi weboldal fejlesztés", "Landing page készítés", "Webáruház fejlesztés", "Weboldal újratervezés"
- Each card: Icon, title, description
- Example website subsection with image cards

### Reviews Carousel
- Infinite auto-play carousel showing 4-5 cards simultaneously on desktop
- Card content: Client name, star rating, 2-3 sentence review in Hungarian
- Continuous loop animation
- Optional navigation arrows/dots

### About Section
- Team introduction with "Kik vagyunk mi?" heading
- Mission statement and company story
- Bullet list of value propositions
- Team member cards with photo placeholders, names, roles, descriptions

### Contact Form
- Engaging Hungarian introduction text about collaboration
- Form fields with Hungarian labels: "Név", "Email cím", "Tárgy", "Üzenet"
- Primary button: "Üzenet küldése"
- Contact information display: email (info@novyxdev.hu), phone, address
- Frontend validation indicators

### Footer
- Copyright text: "© [year] NovyxDev. Minden jog fenntartva."
- Links: "Impresszum", "Adatkezelési tájékoztató"

## Visual Treatment
- **Rounded Corners**: rounded-lg to rounded-xl on cards and buttons
- **Shadows**: Card shadows for depth (shadow-md, shadow-lg on hover)
- **Hover Effects**: Scale transforms, shadow increases on interactive elements
- **Borders**: Subtle borders on form inputs and cards using blue tones
- **Spacing**: Generous whitespace for breathing room

## Images
- **Hero Section**: Large mockup/preview images of example websites
- **Reference Cards**: Project preview images (1-2 per card)
- **Reference Modal**: Multiple detailed project images
- **Service Examples**: Website example images
- **Team Photos**: Placeholder or actual team member photos
- All images should maintain professional quality and consistent aspect ratios

## Key Design Constraints
- NO gradients anywhere - solid colors only
- Blue and white color scheme exclusively
- All UI text in Hungarian
- Responsive across all device sizes
- One-page scrolling layout with section anchors
- No authentication or login systems