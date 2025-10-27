-----

## 1\. Brand Overview

The design system for "Preclinic" presents a **clean, corporate, and technical** visual identity, tailored for a professional admin dashboard environment.

  * **Visual Personality & Tone**: The overall mood is professional and focused, prioritizing clarity and usability for data-heavy interfaces. It avoids playful or overly expressive elements, aiming for a reliable and efficient user experience.
  * **Interface Feel**: The interface feels modern and structured, built on a foundation of clear hierarchies and consistent spacing. The use of the 'Inter' typeface enhances readability, while the well-defined color system provides clear visual cues for user interactions and information status. The system is highly themeable, with explicit support for light/dark modes and multiple sidebar/topbar color variations, indicating a need for customizability and brand flexibility.

-----

## 2\. Color System

The color system is comprehensive, with dedicated palettes for primary actions, system feedback, text, and surfaces. It includes variants for hover states, transparent backgrounds, and a full dark mode theme.

### Primary & Secondary Colors

| Role | Color | HEX | RGB |
| :--- | :--- | :--- | :--- |
| **Primary** |  | `#2E37A4` | `46, 55, 164` |
| Primary Hover |  | `#3C449C` | `60, 68, 156` |
| **Secondary** |  | `#00D3C7` | `0, 211, 199` |
| Secondary Hover |  | `#17C2B9` | `23, 194, 185` |

-----

### System & Accent Colors

These colors are used for feedback and to highlight specific states like success, danger, or information.

| Role | Color | HEX | RGB |
| :--- | :--- | :--- | :--- |
| **Success** |  | `#27AE60` | `39, 174, 96` |
| **Danger** |  | `#EF1E1E` | `239, 30, 30` |
| **Warning** |  | `#E2B93B` | `226, 185, 59` |
| **Info** |  | `#2F80ED` | `47, 128, 237` |
| **Dark** |  | `#0B0D0E` | `11, 13, 14` |
| **Indigo** |  | `#3538CD` | `53, 56, 205` |
| **Orange** |  | `#E04F16` | `224, 79, 22` |
| **Pink** |  | `#DD2590` | `221, 37, 144` |
| **Purple** |  | `#800080` | `128, 0, 128` |

-----

### Surface, Text, & Border Colors

This palette defines the colors for backgrounds, text, and UI boundaries.

| Role | Color | HEX | RGB |
| :--- | :--- | :--- | :--- |
| **Body Background** | Light Gray | `#F5F6F8` | `245, 246, 248` |
| **Surface Background** | White | `#FFFFFF` | `255, 255, 255` |
| **Heading Text** | Dark Blue-Gray | `#0A1B39` | `10, 27, 57` |
| **Body Text** | Medium Gray | `#6C7688` | `108, 118, 136` |
| **Border Color** | Light Gray | `#E7E8EB` | `231, 232, 235` |

-----

### Gradients

The system utilizes linear gradients for specific theming options on sidebars and topbars.

  * **Gradient 1**: `linear-gradient(180deg, #7A7DF9 0%, #3538CD 100%)`
  * **Gradient 2**: `linear-gradient(180deg, #4E59DB 0%, #0C1367 100%)`
  * **Gradient 3**: `linear-gradient(90deg, #2EF4E9 0%, #01ADA3 100%)`
  * **Gradient 4**: `linear-gradient(90deg, #484545 0%, #030303 100%)`
  * **Gradient 5**: `linear-gradient(90deg, #B319B3 0%, #530953 100%)`

-----

## 3\. Typography

The typographic system is built around the **Inter** font family, chosen for its excellent readability on screens. The hierarchy is well-defined to create clear and scannable content.

  * **Font Family**: `Inter, sans-serif`
  * **Base Font Size**: `$font-size-base = 0.875rem` (14px)

### Font Weights

| Name | Weight |
| :--- | :--- |
| **Normal** | 400 |
| **Medium** | 500 |
| **Semibold** | 600 |
| **Bold** | 700 |

### Typographic Scale

| Element | Font Size (Calculated) | Font Weight |
| :--- | :--- | :--- |
| **H1** | `calc(1.325rem + 0.9vw)` (approx. 32px on desktop) | 500 |
| **H2** | `calc(1.3rem + 0.6vw)` (approx. 28px on desktop) | 500 |
| **H3** | `calc(1.275rem + 0.3vw)` (approx. 24px on desktop) | 500 |
| **H4** | `1.25rem` (20px) | 500 |
| **H5** | `1.125rem` (18px) | 500 |
| **H6** | `1rem` (16px) | 500 |
| **Body** | `0.875rem` (14px) | 400 |
| **Button** | `0.75rem` (12px) | 600 |

-----

## 4\. Layout & Spacing

The layout is based on a flexible, responsive grid system similar to Bootstrap. Spacing is handled via a utility-based scale, though not strictly linear.

### Breakpoints

| Name | Dimension |
| :--- | :--- |
| **sm** | 576px |
| **md** | 768px |
| **lg** | 992px |
| **xl** | 1200px |
| **xxl** | 1500px |

### Spacing Scale

The system uses utility classes (e.g., `.p-1`, `.m-2`) for padding and margins. The increments are based on a base value of approximately `0.3125rem`.

| Utility | Value |
| :--- | :--- |
| `1` | `$spacer * 0.25` (`0.3125rem`) |
| `2` | `$spacer * 0.5` (`0.625rem`) |
| `3` | `$spacer` (`1.25rem`) |
| `4` | `$spacer * 1.5` (`1.875rem`) |
| `5` | `$spacer * 3` (`3.75rem`) |

*Note: The scale has an inconsistency where the `x3` utility appears to be the base `1.25rem` spacer.*

### Corner Radius

The system uses a simple and consistent scale for rounding corners.

| Name | Value | Use Case |
| :--- | :--- | :--- |
| **Base** | `0.3rem` | Cards, Inputs, Buttons |
| **Large** | `0.6rem` | Modals, Large containers |
| **Pill** | `50%` / `50rem` | Pills, Avatars |

-----

## 5\. Components & Patterns

The UI is constructed from a set of recurring components with consistent styling.

### Buttons

  * **Corner Radius**: `0.3rem`
  * **Font Size**: `0.75rem` (12px)
  * **Font Weight**: `600`
  * **Padding**: `0.5rem 1.1rem`
  * **States**:
      * **Primary**: Solid blue (`#2E37A4`) background, white text.
      * **Outline**: Transparent background, blue text and border. On hover, fills with blue.
      * **Hover**: Lightens or darkens slightly depending on the button type.

### Cards

  * **Corner Radius**: `0.3rem`
  * **Border**: `1px solid #E7E8EB`
  * **Shadow**: `0px 0px 35px 0px rgba(104, 134, 177, 0.15)`
  * **Padding**: `1.25rem` in `card-body`.
  * **Header Padding**: `0.9375rem 1.25rem`.

### Form Inputs (`.form-control`)

  * **Corner Radius**: `0.3rem`
  * **Border**: `1px solid #E7E8EB`
  * **Padding**: `0.5rem 0.77rem`
  * **Font Size**: `0.75rem` (12px)
  * **Background**: White (`#FFFFFF`)
  * **Focus State**: No visible box-shadow; border color remains the same.

### Modals

  * **Corner Radius**: `0.6rem` (Large)
  * **Shadow**: `0px 1px 1px 0px rgba(0, 0, 0, 0.05)`
  * **Padding**: `1.25rem` for body, header, and footer.
  * **Header Border**: A `1px` bottom border separates the header from the body.

### Alerts

  * **Corner Radius**: `0.3rem`
  * **Padding**: `0.8rem 1rem`
  * **Styling**: Use "subtle" background colors (e.g., `rgb(223.65, 225, 241.35)` for primary) with a darker text color for emphasis.

-----

## 6\. Theme Specification (JSON)

This JSON object provides a structured representation of the design tokens for use in a design system or development environment.

```json
{
  "colors": {
    "primary": {
      "base": "#2E37A4",
      "hover": "#3C449C",
      "subtle": "#ECEDF7",
      "rgb": "46, 55, 164"
    },
    "secondary": {
      "base": "#00D3C7",
      "hover": "#17C2B9",
      "subtle": "#E8FBFA",
      "rgb": "0, 211, 199"
    },
    "system": {
      "success": "#27AE60",
      "danger": "#EF1E1E",
      "warning": "#E2B93B",
      "info": "#2F80ED"
    },
    "surface": {
      "background": "#F5F6F8",
      "base": "#FFFFFF",
      "light": "#F5F6F8",
      "dark": "#0B0D0E"
    },
    "text": {
      "heading": "#0A1B39",
      "body": "#6C7688",
      "muted": "#858D9C"
    },
    "border": {
      "base": "#E7E8EB"
    },
    "grayscale": {
      "100": "#CED1D7",
      "200": "#B6BBC4",
      "300": "#9DA4B0",
      "400": "#858D9C",
      "500": "#6C7688",
      "600": "#545F74",
      "700": "#3B4961",
      "800": "#23324D",
      "900": "#0A1B39"
    }
  },
  "typography": {
    "fontFamily": "Inter, sans-serif",
    "baseFontSize": "0.875rem",
    "weights": {
      "normal": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    },
    "scale": {
      "h1": "calc(1.325rem + 0.9vw)",
      "h2": "calc(1.3rem + 0.6vw)",
      "h3": "calc(1.275rem + 0.3vw)",
      "h4": "1.25rem",
      "h5": "1.125rem",
      "h6": "1rem",
      "body": "0.875rem",
      "small": "0.75rem"
    }
  },
  "spacing": {
    "scale": {
      "xs": "0.3125rem",
      "sm": "0.625rem",
      "md": "1.25rem",
      "lg": "1.875rem",
      "xl": "3.75rem"
    },
    "gutter": "1.25rem"
  },
  "radius": {
    "base": "0.3rem",
    "lg": "0.6rem",
    "pill": "50rem"
  },
  "shadows": {
    "sm": "0px 1px 1px 0px rgba(0, 0, 0, 0.05)",
    "base": "0px 0px 35px 0px rgba(104, 134, 177, 0.15)",
    "lg": "0 0 45px 0 rgba(108, 118, 136, 0.2)"
  },
  "components": {
    "button": {
      "borderRadius": "0.3rem",
      "padding": "0.5rem 1.1rem",
      "fontSize": "0.75rem",
      "fontWeight": 600
    },
    "card": {
      "borderRadius": "0.3rem",
      "border": "1px solid #E7E8EB",
      "shadow": "0px 0px 35px 0px rgba(104, 134, 177, 0.15)",
      "padding": "1.25rem"
    },
    "input": {
      "borderRadius": "0.3rem",
      "border": "1px solid #E7E8EB",
      "padding": "0.5rem 0.77rem",
      "fontSize": "0.75rem"
    }
  }
}
```