# Tokenized Stocks Design System

A cohesive, premium fintech design system built with Tailwind CSS and shadcn/ui components. This system provides a consistent visual language for the Tokenized Stocks Dashboard, inspired by modern fintech applications like Trade Republic and Finary.

## 🎨 Design Principles

- **Clean & Minimal**: High-contrast, typographic focus with subtle depth
- **Dark Mode First**: Optimized for both light and dark themes
- **Financial Focus**: Typography optimized for numbers and dense data tables
- **Accessibility**: WCAG AA compliant color combinations
- **Consistency**: Unified design tokens across all components

## 🎯 Core Features

- **CSS Variables**: Centralized design tokens for easy theming
- **Tailwind Integration**: Extended theme with custom utilities
- **Component Library**: Reusable UI components built with shadcn/ui
- **Typography System**: Inter for UI, Space Grotesk for headings
- **Responsive Design**: Mobile-first approach with consistent breakpoints

## 🚀 Quick Start

### 1. Import Components

```tsx
import { Button, Card, Badge } from '@/components/ui';
import { Wordmark, LogoMark } from '@/components/Brand';
```

### 2. Use Design Tokens

```tsx
// Colors
<div className="bg-background text-foreground">
<div className="bg-accent text-accent-foreground">
<div className="bg-success text-success-foreground">

// Typography
<h1 className="display">Display Heading</h1>
<h2 className="h1">H1 Heading</h2>
<p className="body">Body text</p>
<span className="numeric">123,456.78</span>

// Spacing & Layout
<div className="rounded-lg shadow-soft">
<div className="p-6 border border-border">
```

## 🎨 Design Tokens

### Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--bg` | `#F7F8FA` | `#0B0F14` | Page background |
| `--fg` | `#0B0F14` | `#F7F8FA` | Primary text |
| `--card` | `#FFFFFF` | `#1F2937` | Card backgrounds |
| `--border` | `#E5E7EB` | `#374151` | Borders & dividers |
| `--accent` | `#10B981` | `#10B981` | Primary brand color |
| `--success` | `#059669` | `#059669` | Positive states |
| `--danger` | `#DC2626` | `#DC2626` | Error states |
| `--warning` | `#D97706` | `#D97706` | Warning states |

### Typography

| Class | Font | Weight | Size | Line Height |
|-------|------|--------|------|-------------|
| `.display` | Space Grotesk | 700 | 3.5rem | 1.1 |
| `.h1` | Space Grotesk | 600 | 2.5rem | 1.2 |
| `.h2` | Space Grotesk | 600 | 2rem | 1.3 |
| `.h3` | Space Grotesk | 600 | 1.5rem | 1.4 |
| `.h4` | Space Grotesk | 600 | 1.25rem | 1.4 |
| `.body` | Inter | 400 | 1rem | 1.6 |
| `.body-sm` | Inter | 400 | 0.875rem | 1.5 |
| `.caption` | Inter | 500 | 0.75rem | 1.4 |
| `.numeric` | Inter | 400 | 1rem | 1.6 |

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-xs` | `0.25rem` | Small elements |
| `--radius-sm` | `0.375rem` | Buttons, inputs |
| `--radius` | `0.5rem` | Default radius |
| `--radius-md` | `0.75rem` | Cards, panels |
| `--radius-lg` | `1rem` | Large cards |
| `--radius-xl` | `1.5rem` | Hero sections |
| `--radius-2xl` | `2rem` | Full-width sections |

### Shadows

| Token | Usage |
|-------|-------|
| `--shadow-sm` | Subtle elevation |
| `--shadow` | Default elevation |
| `--shadow-md` | Medium elevation |
| `--shadow-lg` | High elevation |
| `--shadow-xl` | Maximum elevation |
| `--shadow-soft` | Soft, subtle depth |

## 🧩 Components

### Brand Components

#### Wordmark
```tsx
import { Wordmark } from '@/components/Brand';

<Wordmark size="lg" />  // Large
<Wordmark size="md" />  // Medium (default)
<Wordmark size="sm" />  // Small
```

#### Logo Mark
```tsx
import { LogoMark } from '@/components/Brand';

<LogoMark size="lg" />  // Large
<LogoMark size="md" />  // Medium (default)
<LogoMark size="sm" />  // Small
```

### UI Components

#### Button
```tsx
import { Button } from '@/components/ui/button';

// Variants
<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>
<Button variant="destructive">Destructive</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔍</Button>
```

#### Card
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

#### Badge
```tsx
import { Badge } from '@/components/ui/badge';

<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="destructive">Destructive</Badge>
```

#### Table
```tsx
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Symbol</TableHead>
      <TableHead className="text-right">Price</TableHead>
      <TableHead className="text-right">Change</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">AAPL</TableCell>
      <TableCell className="text-right numeric">$150.25</TableCell>
      <TableCell className="text-right text-success">+2.45%</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## 🎭 Theme Switching

The design system supports light, dark, and system themes:

```tsx
import { ThemeToggle } from '@/components/ui/theme-toggle';

// Add to your header/navigation
<ThemeToggle />
```

### Theme Provider Setup

```tsx
import { ThemeProvider } from '@/lib/hooks/use-theme';

<ThemeProvider defaultTheme="system" storageKey="ui-theme">
  {/* Your app content */}
</ThemeProvider>
```

## 🛠️ Utility Classes

### Typography Utilities
- `.muted` - Muted text color
- `.numeric` - Tabular numbers for financial data
- `.kbd` - Keyboard shortcut styling
- `.chip` - Small pill-shaped elements

### Layout Utilities
- `.card-grid` - Responsive card grid layout
- `.shadow-soft` - Soft shadow for subtle depth

### Animation Utilities
- `.animate-fade-in` - Fade in animation
- `.animate-slide-up` - Slide up animation
- `.animate-slide-down` - Slide down animation

## 📱 Responsive Design

The design system is built with a mobile-first approach:

```tsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Responsive spacing
<div className="p-4 sm:p-6 lg:p-8">

// Responsive typography
<h1 className="text-2xl sm:text-3xl lg:text-4xl">
```

## 🎨 Customization

### Adding New Colors

1. Add CSS variables to `globals.css`:
```css
:root {
  --custom-color: #your-color;
}

.dark {
  --custom-color: #your-dark-color;
}
```

2. Extend Tailwind config:
```ts
// tailwind.config.ts
colors: {
  custom: 'hsl(var(--custom-color))',
}
```

### Adding New Components

1. Create component in `components/ui/`
2. Use design tokens for consistent styling
3. Export from `components/ui/index.ts`
4. Document in this README

## 🧪 Testing

View the complete design system at `/styleguide` to see all components, tokens, and variations in action.

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Inter Font](https://rsms.me/inter/)
- [Space Grotesk Font](https://fonts.google.com/specimen/Space+Grotesk)

## 🤝 Contributing

When adding new components or modifying existing ones:

1. Follow the established patterns
2. Use design tokens consistently
3. Test in both light and dark themes
4. Update this documentation
5. Ensure accessibility compliance

## 📄 License

This design system is part of the Tokenized Stocks Dashboard project.
