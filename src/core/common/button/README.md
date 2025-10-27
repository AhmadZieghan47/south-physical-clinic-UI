# Button Component Documentation

A flexible, reusable Button component system supporting all variants from the UI design system.

## Installation

```typescript
import { Button, IconButton } from '@/core/common/button';
```

## Components

### Button

The main button component with support for all variants, styles, sizes, and modifiers.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `ButtonVariant` | `"primary"` | Button color variant: primary, secondary, success, danger, warning, info, light, dark, white |
| `styleVariant` | `ButtonStyle` | `"default"` | Button appearance: default, outline, soft, gradient, gradient2 |
| `size` | `ButtonSize` | `"md"` | Button size: sm, md, lg |
| `rounded` | `boolean` | `false` | Apply rounded-pill style |
| `animation` | `boolean` | `false` | Enable button animation effect |
| `block` | `boolean` | `false` | Make button full width |
| `loading` | `boolean` | `false` | Show loading spinner and disable button |
| `icon` | `ReactNode` | `undefined` | Icon element to display |
| `iconPosition` | `"left" \| "right"` | `"left"` | Position of icon relative to text |
| `labelIcon` | `boolean` | `false` | Apply label button styling to icon |
| `children` | `ReactNode` | - | Button content/text |
| `className` | `string` | `""` | Additional CSS classes |
| `disabled` | `boolean` | `false` | Disable button interaction |
| `type` | `string` | `"button"` | HTML button type |
| ...rest | `ButtonHTMLAttributes` | - | All standard button HTML attributes |

### IconButton

A specialized wrapper for icon-only buttons with enforced accessibility. Uses Lucide React's DynamicIcon component for consistent icon rendering.

#### Props

Inherits all Button props except `children` and `icon`, plus:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `iconName` | `string` | ✅ | Lucide icon name (e.g., "camera", "trash-2", "pencil") |
| `ariaLabel` | `string` | ✅ | Accessible label for screen readers |
| `iconColor` | `string` | ❌ | Icon color (e.g., "red", "#ff0000") |
| `iconSize` | `number` | ❌ | Icon size in pixels (default: 16) |

## Usage Examples

### Basic Buttons

```tsx
// Default button
<Button variant="primary">Primary</Button>

// Outline button
<Button variant="danger" styleVariant="outline">Danger</Button>

// Soft button
<Button variant="success" styleVariant="soft">Success</Button>

// Rounded button
<Button variant="warning" rounded>Warning</Button>
```

### Gradient Buttons

```tsx
// Gradient style 1
<Button variant="info" styleVariant="gradient">Info</Button>

// Gradient style 2 (with btn-effect)
<Button variant="primary" styleVariant="gradient2">Primary</Button>
```

### Buttons with Icons

```tsx
// Icon on the left (default)
<Button variant="primary" icon={<i className="ti ti-mood-smile" />}>
  Primary
</Button>

// Icon on the right
<Button variant="success" icon={<i className="ti ti-arrow-right" />} iconPosition="right">
  Next
</Button>

// Label button style
<Button variant="primary" icon={<i className="ti ti-mood-smile" />} labelIcon>
  Primary
</Button>

// Rounded label button
<Button variant="success" icon={<i className="ti ti-checks" />} labelIcon rounded>
  Success
</Button>
```

### Size Variations

```tsx
<Button variant="primary" size="lg">Large</Button>
<Button variant="success" size="md">Normal</Button>
<Button variant="danger" size="sm">Small</Button>
```

### Icon-Only Buttons

```tsx
// Solid icon button
<IconButton 
  variant="primary" 
  iconName="bell" 
  ariaLabel="Notifications"
/>

// Outline icon button
<IconButton 
  variant="danger" 
  styleVariant="outline"
  iconName="trash-2" 
  ariaLabel="Delete"
/>

// Icon button with custom color and size
<IconButton 
  variant="primary" 
  iconName="camera" 
  iconColor="red" 
  iconSize={24}
  ariaLabel="Take photo"
/>
```

### Special States

```tsx
// Loading state
<Button variant="primary" loading>Saving...</Button>

// Disabled state
<Button variant="success" disabled>Disabled</Button>

// Animation button
<Button variant="primary" animation>Hover Me</Button>
```

### Block Buttons (Full Width)

```tsx
<div className="d-grid gap-2">
  <Button variant="primary">Block Button</Button>
  <Button variant="warning">Another Block Button</Button>
</div>
```

### Interactive Buttons

```tsx
<Button 
  variant="primary" 
  onClick={() => handleClick()}
  icon={<i className="ti ti-download" />}
>
  Download
</Button>

<Button 
  variant="danger"
  onClick={() => handleDelete()}
  loading={isDeleting}
  icon={<i className="ti ti-trash" />}
>
  {isDeleting ? 'Deleting...' : 'Delete'}
</Button>
```

## TypeScript Types

```typescript
type ButtonVariant = 
  | "primary" | "secondary" | "success" | "danger" 
  | "warning" | "info" | "light" | "dark" | "white";

type ButtonStyle = 
  | "default"      // btn-{variant}
  | "outline"      // btn-outline-{variant}
  | "soft"         // btn-soft-{variant}
  | "gradient"     // bg-gradient
  | "gradient2";   // bg-{variant}-gradient

type ButtonSize = "sm" | "md" | "lg";
```

## Accessibility

### Button Component
- Uses semantic `<button>` element
- Supports all native button attributes
- Keyboard navigation works out of the box
- Loading spinner has proper ARIA attributes
- Animation buttons maintain text in `data-text` for screen readers

### IconButton Component
- **Requires** `ariaLabel` prop for accessibility
- Screen readers will announce the button's purpose
- Focus ring is visible by default

## Best Practices

1. **Use semantic buttons**: Prefer `<Button>` over styled `<div>` elements
2. **Provide accessible labels**: Always use `ariaLabel` for icon-only buttons
3. **Loading states**: Set `loading={true}` during async operations
4. **Disabled vs Loading**: Use `disabled` for permanently unavailable actions, `loading` for temporary states
5. **Icon positioning**: Use `iconPosition="right"` for "next/forward" actions, left for most other cases
6. **Label buttons**: Use `labelIcon={true}` when the icon is integral to the button's meaning
7. **Button types**: Always specify `type="button"` for non-submit buttons in forms
8. **Consistent variants**: Use `danger` for destructive actions, `success` for confirmations, `primary` for main actions

## CSS Classes Generated

The component automatically generates appropriate CSS classes:

```typescript
// Example: Primary button with icon
<Button variant="primary" icon={...} labelIcon>
// Generates: "btn btn-primary btn-label"

// Example: Small outline danger button
<Button variant="danger" styleVariant="outline" size="sm">
// Generates: "btn btn-outline-danger btn-sm"

// Example: Rounded gradient button
<Button variant="success" styleVariant="gradient" rounded>
// Generates: "btn btn-success bg-gradient rounded-pill"
```

## Common Patterns

### Form Submit Button

```tsx
<Button 
  type="submit"
  variant="primary"
  loading={isSubmitting}
  disabled={!isValid}
>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</Button>
```

### Delete Confirmation Button

```tsx
<Button 
  variant="danger"
  icon={<i className="ti ti-trash" />}
  onClick={handleDelete}
  loading={isDeleting}
>
  Delete
</Button>
```

### Action Button Group

```tsx
<div className="d-flex gap-2">
  <Button variant="light" onClick={handleCancel}>
    Cancel
  </Button>
  <Button 
    variant="primary" 
    onClick={handleSave}
    loading={isSaving}
  >
    Save
  </Button>
</div>
```

### Icon Button Group

```tsx
<div className="d-flex gap-2">
  <IconButton 
    variant="info" 
    styleVariant="outline"
    iconName="pencil" 
    ariaLabel="Edit"
    onClick={handleEdit}
  />
  <IconButton 
    variant="danger" 
    styleVariant="outline"
    iconName="trash-2" 
    ariaLabel="Delete"
    onClick={handleDelete}
  />
</div>
```

## Available Lucide Icons

IconButton uses Lucide React's DynamicIcon component. Here are some commonly used icon names:

**Common Actions:**
- `pencil`, `edit` - Edit actions
- `trash-2`, `trash` - Delete actions
- `plus`, `plus-circle` - Add actions
- `check`, `check-circle` - Confirm actions
- `x`, `x-circle` - Close/Cancel actions
- `save` - Save actions

**Communication:**
- `bell` - Notifications
- `mail` - Messages/Email
- `phone`, `phone-call` - Phone actions
- `message-circle`, `message-square` - Chat/Messages

**Navigation:**
- `arrow-left`, `arrow-right`, `arrow-up`, `arrow-down` - Navigation
- `chevron-left`, `chevron-right`, `chevron-up`, `chevron-down` - Menus
- `home` - Home navigation
- `settings` - Settings

**Media & Files:**
- `camera` - Photo/Camera
- `image` - Images
- `file`, `file-text` - Files/Documents
- `download`, `upload` - File transfer
- `printer` - Print

**UI Elements:**
- `search` - Search functionality
- `filter` - Filter options
- `menu` - Menu toggle
- `more-horizontal`, `more-vertical` - More options
- `eye`, `eye-off` - Show/Hide

For a complete list of available icons, visit: https://lucide.dev/icons/

## Related Components

- See `Button.example.tsx` for comprehensive visual examples
- See `uiButtons.tsx` for the original design showcase

## Notes

- All styles come from existing Bootstrap/global CSS - no custom CSS needed
- Component follows React functional component patterns
- Fully typed with TypeScript for type safety
- Compatible with all modern React features (hooks, context, etc.)
- IconButton uses Lucide React's DynamicIcon for consistent, tree-shakeable icons

