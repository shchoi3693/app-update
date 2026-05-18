---
version: alpha
name: Lumenpath
description: A bright, citrus-warmed product canvas where every primary
  moment runs in a single Tangerine accent. Display type stays large and
  confident at modest weights; cards float on a pale-cream surface
  separated by hairline borders rather than shadows.
colors:
  primary: "#F76B1C"
  ink: "#1B1A17"
  body: "#3D3A33"
  muted: "#7A7568"
  canvas: "#FFFAF1"
  surface-card: "#FFFFFF"
  hairline: "#E8E1D2"
  on-primary: "#FFFFFF"
typography:	
  display-lg:
    fontFamily: "'Söhne', Inter, sans-serif"
    fontSize: 56px
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: -1.8px
  body-md:
    fontFamily: "Inter, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  button:
    fontFamily: "Inter, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0
rounded:
  none: 0px
  sm: 6px
  md: 10px
  lg: 16px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 24px
  xl: 32px
  section: 80px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 18px
  card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: 20px
---
