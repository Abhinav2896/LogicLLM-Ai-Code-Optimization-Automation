---
name: Light Liquid Glass
colors:
  surface: '#fcf8ff'
  surface-dim: '#dcd8e5'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2ff'
  surface-container: '#f0ecf9'
  surface-container-high: '#eae6f4'
  surface-container-highest: '#e4e1ee'
  on-surface: '#1b1b24'
  on-surface-variant: '#464555'
  inverse-surface: '#302f39'
  inverse-on-surface: '#f3effc'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#46494b'
  on-tertiary: '#ffffff'
  tertiary-container: '#5e6163'
  on-tertiary-container: '#dadcde'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#fcf8ff'
  on-background: '#1b1b24'
  surface-variant: '#e4e1ee'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 24px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 64px
---

## Brand & Style

This design system embodies a "Light Liquid Glass" aesthetic, drawing inspiration from the ethereal, translucent qualities of modern spatial computing interfaces. It targets high-end consumer applications, premium SaaS, and creative platforms where a sense of depth and airiness is paramount. 

The brand personality is sophisticated, optimistic, and technologically advanced. The UI leverages **Glassmorphism** as its core stylistic driver, utilizing frosted surfaces, heavy backdrop blurs, and vibrant "liquid" background orbs to create a multi-dimensional workspace. The emotional response should be one of clarity and weightlessness, moving away from traditional flat surfaces toward a tactile, light-refracting environment.

## Colors

The palette is centered around a high-contrast relationship between a deep **Indigo (#4F46E5)** accent and a **Dark Charcoal (#0F172A)** text layer, set against a highly translucent white foundation.

- **Primary:** Electric Indigo, used for critical actions and active states.
- **Surface:** A semi-transparent white base with a 45% opacity, designed to interact with background gradients.
- **Background Orbs:** Use soft, blurred radial gradients of pastel blue, lavender, pink, and mint. These "liquid" shapes should sit behind the glass layers and move subtly to provide life to the interface.
- **Text:** Primarily near-black to ensure maximum legibility against the vibrant, light-refracting backgrounds.

## Typography

This design system utilizes **Plus Jakarta Sans** for its modern, geometric, and friendly characteristics. The soft curves of the typeface complement the generous corner radii of the UI elements. 

For display and headlines, use tight letter spacing and bold weights to ground the airy interface. Body text should maintain generous line heights to ensure readability over semi-transparent surfaces. In mobile views, scale down display sizes to prevent text wrapping issues while maintaining the distinctive bold weight.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** model with high internal breathing room. 

- **Desktop:** 12-column grid with 64px outer margins and 24px gutters. Elements should feel grouped within large glass panels.
- **Mobile:** 4-column grid with 20px margins.
- **Rhythm:** Use an 8px base unit. All internal padding for glass containers should start at 24px to match the corner radius, creating a harmonious "inset" look.
- **Depth Spacing:** Use larger vertical margins (48px+) between distinct sections to allow the liquid background orbs to be visible and felt.

## Elevation & Depth

Elevation is achieved through **optical thickness** rather than traditional black shadows.

- **Backdrop Blur:** All glass surfaces must apply a `backdrop-filter: blur(40px)`. This creates the "frosted" effect.
- **Layering:** Use stacking to define hierarchy. Lower-level containers have 45% opacity; elevated modals or menus have 70% opacity and a subtle 1px white inner-glow (stroke) to simulate light catching the edge of the glass.
- **Shadows:** Avoid dark, heavy shadows. Use soft, colored "ambient glows" that match the underlying liquid background color to simulate the way light passes through colored glass.

## Shapes

The shape language is defined by **ultra-rounded corners**. 

- **Main Containers:** Use a 24px (1.5rem) radius for all cards and primary containers.
- **Nested Elements:** Use a 16px radius for elements inside a container to maintain visual nested harmony.
- **Buttons/Inputs:** Use a 12px or fully rounded (pill) shape depending on the context.
- **Stroke:** All shapes should have a 1px solid border at 60% white opacity. This "specular edge" is critical for making the glass appear tangible.

## Components

- **Buttons:** Primary buttons use a solid Indigo fill with white text. Secondary buttons are frosted glass with a 1px white border and Indigo text. 
- **Cards:** Cards are the primary expression of the "Liquid Glass" style. They must have the 24px radius, 40px backdrop blur, and 1px semi-transparent border.
- **Input Fields:** Use a more subtle glass effect (20% white opacity) with a darker 1px border when focused. Text is always charcoal.
- **Lists:** Items should be separated by high-transparency dividers (10% charcoal) or placed in individual glass "tiles."
- **Chips/Labels:** Small, high-contrast Indigo or Charcoal capsules with a 50% opacity background of the same color, creating a "tinted glass" look.
- **Modals:** Heavy backdrop blur (60px) on the background layer to pull the modal forward, with a 75% opacity white surface.