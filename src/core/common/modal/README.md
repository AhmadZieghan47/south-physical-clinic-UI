# Modal Component

A fully-featured, programmatic Modal component built on Bootstrap 5 that supports all modal variants with React state control.

## Features

- **Programmatic Control**: Open/close via React state
- **Multiple Sizes**: sm, md (default), lg, xl, full-width
- **Positioning**: top, center (default), bottom
- **Style Variants**: default, primary, success, info, warning, danger, dark
- **Header Styles**: default, colored, filled
- **Alert Modals**: Compact modals with icons
- **Scrollable Content**: For long modal bodies
- **Static Backdrop**: Prevent closing on backdrop click or ESC key
- **Fullscreen**: Support for all Bootstrap breakpoints
- **Accessibility**: Full keyboard navigation and screen reader support
- **Focus Management**: Automatic focus trapping and restoration

## Basic Usage

```tsx
import { useState } from 'react';
import { Modal } from '@/core/common/modal';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className="btn btn-primary" 
        onClick={() => setIsOpen(true)}
      >
        Open Modal
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Modal Title"
        footer={
          <>
            <button 
              className="btn btn-secondary" 
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
            <button className="btn btn-primary">
              Save changes
            </button>
          </>
        }
      >
        <p>This is the modal body content.</p>
      </Modal>
    </>
  );
}
```

## Size Variants

### Small Modal

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  size="sm"
  title="Small Modal"
>
  <p>Content for small modal.</p>
</Modal>
```

### Large Modal

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  size="lg"
  title="Large Modal"
>
  <p>Content for large modal.</p>
</Modal>
```

### Extra Large Modal

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  size="xl"
  title="Extra Large Modal"
>
  <p>Content for extra large modal.</p>
</Modal>
```

### Full Width Modal

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  size="full-width"
  title="Full Width Modal"
>
  <p>Content for full width modal.</p>
</Modal>
```

## Position Variants

### Top Position

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  position="top"
  title="Top Modal"
>
  <p>Modal aligned to top of viewport.</p>
</Modal>
```

### Center Position (Default)

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  position="center"
  title="Centered Modal"
>
  <p>Modal centered vertically.</p>
</Modal>
```

### Bottom Position

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  position="bottom"
  title="Bottom Modal"
>
  <p>Modal aligned to bottom of viewport.</p>
</Modal>
```

## Colored Header Modals

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  variant="primary"
  headerStyle="colored"
  title="Primary Header"
>
  <p>Modal with primary colored header.</p>
</Modal>

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  variant="success"
  headerStyle="colored"
  title="Success Header"
>
  <p>Modal with success colored header.</p>
</Modal>

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  variant="danger"
  headerStyle="colored"
  title="Danger Header"
>
  <p>Modal with danger colored header.</p>
</Modal>
```

## Filled Modals

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  variant="primary"
  filled
  title="Primary Filled"
>
  <p>Entire modal has primary background color.</p>
</Modal>

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  variant="success"
  filled
  title="Success Filled"
>
  <p>Entire modal has success background color.</p>
</Modal>
```

## Alert Modals

Alert modals are compact modals with icons, perfect for notifications and confirmations.

### Success Alert

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  size="sm"
  position="center"
  variant="success"
  filled
  alert
  title="Well Done!"
  footer={
    <button 
      className="btn btn-secondary" 
      onClick={() => setIsOpen(false)}
    >
      Continue
    </button>
  }
>
  <p>Congratulations! Your operation was successful.</p>
</Modal>
```

### Info Alert

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  size="sm"
  variant="info"
  alert
  title="Heads up!"
>
  <p>Please be informed about scheduled maintenance.</p>
</Modal>
```

### Warning Alert

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  size="sm"
  variant="warning"
  alert
  title="Warning"
>
  <p>Please review this information carefully.</p>
</Modal>
```

### Danger Alert

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  size="sm"
  variant="danger"
  filled
  alert
  title="Oh snap!"
>
  <p>A critical error has occurred.</p>
</Modal>
```

### Custom Alert Icon

```tsx
import { Trash } from 'lucide-react';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  size="sm"
  variant="danger"
  alert
  alertIcon={<Trash className="h1 text-danger" />}
  title="Delete Confirmation"
>
  <p>Are you sure you want to delete this item?</p>
</Modal>
```

## Scrollable Modal

For modals with long content:

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  scrollable
  title="Scrollable Modal"
>
  <p>Long content here...</p>
  <p>More content...</p>
  <p>Even more content...</p>
  {/* ... many more paragraphs ... */}
</Modal>
```

## Static Backdrop

Prevent closing when clicking outside or pressing ESC:

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  staticBackdrop
  title="Static Backdrop Modal"
>
  <p>Click outside or press ESC - this modal won't close.</p>
  <p>You must use the close button or footer buttons.</p>
</Modal>
```

## Fullscreen Modals

### Always Fullscreen

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  fullscreen
  title="Fullscreen Modal"
>
  <p>This modal is always fullscreen.</p>
</Modal>
```

### Fullscreen Below Breakpoint

```tsx
// Fullscreen below sm (576px)
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  fullscreen="sm"
  title="Fullscreen Below SM"
>
  <p>Fullscreen on mobile, normal modal on larger screens.</p>
</Modal>

// Fullscreen below md (768px)
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  fullscreen="md"
  title="Fullscreen Below MD"
>
  <p>Fullscreen on tablets and mobile.</p>
</Modal>

// Fullscreen below lg (992px)
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  fullscreen="lg"
  title="Fullscreen Below LG"
>
  <p>Fullscreen on medium screens and smaller.</p>
</Modal>

// Fullscreen below xl (1200px)
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  fullscreen="xl"
  title="Fullscreen Below XL"
>
  <p>Fullscreen on large screens and smaller.</p>
</Modal>

// Fullscreen below xxl (1400px)
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  fullscreen="xxl"
  title="Fullscreen Below XXL"
>
  <p>Fullscreen on extra large screens and smaller.</p>
</Modal>
```

## Modal Without Close Button

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  closeButton={false}
  title="No Close Button"
  footer={
    <button 
      className="btn btn-primary" 
      onClick={() => setIsOpen(false)}
    >
      Done
    </button>
  }
>
  <p>This modal has no close button in header.</p>
</Modal>
```

## Loading State

Disable close button during async operations:

```tsx
const [isLoading, setIsLoading] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  isLoading={isLoading}
  title="Processing"
  footer={
    <>
      <button 
        className="btn btn-secondary" 
        onClick={() => setIsOpen(false)}
        disabled={isLoading}
      >
        Cancel
      </button>
      <button 
        className="btn btn-primary"
        disabled={isLoading}
        onClick={async () => {
          setIsLoading(true);
          await performAsyncOperation();
          setIsLoading(false);
          setIsOpen(false);
        }}
      >
        {isLoading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" />
            Processing...
          </>
        ) : (
          'Submit'
        )}
      </button>
    </>
  }
>
  <p>Please wait while we process your request.</p>
</Modal>
```

## Advanced Examples

### Form Modal

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Edit User"
  footer={
    <>
      <button 
        className="btn btn-secondary" 
        onClick={() => setIsOpen(false)}
      >
        Cancel
      </button>
      <button 
        className="btn btn-primary"
        onClick={handleSubmit}
      >
        Save Changes
      </button>
    </>
  }
>
  <form>
    <div className="mb-3">
      <label htmlFor="username" className="form-label">Username</label>
      <input 
        type="text" 
        className="form-control" 
        id="username"
        placeholder="Enter username"
      />
    </div>
    <div className="mb-3">
      <label htmlFor="email" className="form-label">Email</label>
      <input 
        type="email" 
        className="form-control" 
        id="email"
        placeholder="Enter email"
      />
    </div>
  </form>
</Modal>
```

### Confirmation Modal

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  size="sm"
  position="center"
  variant="warning"
  alert
  title="Confirm Action"
  footer={
    <>
      <button 
        className="btn btn-secondary" 
        onClick={() => setIsOpen(false)}
      >
        Cancel
      </button>
      <button 
        className="btn btn-warning"
        onClick={() => {
          handleConfirm();
          setIsOpen(false);
        }}
      >
        Confirm
      </button>
    </>
  }
>
  <p>Are you sure you want to proceed with this action?</p>
</Modal>
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | Required | Controls modal visibility |
| `onClose` | `() => void` | Required | Callback when modal should close |
| `title` | `string` | `undefined` | Modal title text |
| `children` | `React.ReactNode` | Required | Modal body content |
| `footer` | `React.ReactNode` | `undefined` | Modal footer content |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full-width'` | `'md'` | Modal size |
| `position` | `'top' \| 'center' \| 'bottom'` | `'center'` | Vertical position |
| `variant` | `'default' \| 'primary' \| 'success' \| 'info' \| 'warning' \| 'danger' \| 'dark'` | `'default'` | Color variant |
| `headerStyle` | `'default' \| 'colored' \| 'filled'` | `'default'` | Header style |
| `filled` | `boolean` | `false` | Apply background to entire modal |
| `scrollable` | `boolean` | `false` | Enable scrollable body |
| `staticBackdrop` | `boolean` | `false` | Prevent closing on backdrop click/ESC |
| `closeButton` | `boolean` | `true` | Show close button in header |
| `fullscreen` | `boolean \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl'` | `false` | Fullscreen mode |
| `alert` | `boolean` | `false` | Use alert/compact style |
| `alertIcon` | `React.ReactNode` | Auto | Custom icon for alert modals |
| `ariaLabelledBy` | `string` | `'modal-title'` | ARIA label ID |
| `className` | `string` | `''` | Custom class for modal wrapper |
| `dialogClassName` | `string` | `''` | Custom class for modal-dialog |
| `contentClassName` | `string` | `''` | Custom class for modal-content |
| `isLoading` | `boolean` | `false` | Disable close button during loading |

## Accessibility

The Modal component is fully accessible:

- **Keyboard Navigation**: ESC key closes modal (unless `staticBackdrop`)
- **Focus Management**: Automatically focuses modal on open and restores focus on close
- **ARIA Attributes**: Includes proper `role`, `aria-modal`, and `aria-labelledby`
- **Screen Reader Support**: All interactive elements have proper labels

## Best Practices

1. **Always provide a title** for better accessibility
2. **Use appropriate size** for your content (avoid oversized modals)
3. **Provide clear actions** in the footer (Cancel + Primary action)
4. **Use alert modals** for important notifications
5. **Set staticBackdrop** for critical forms to prevent accidental closes
6. **Use loading states** during async operations
7. **Keep content focused** - don't overwhelm users with too much information

## Browser Support

The Modal component works in all modern browsers that support:
- React 18+
- Bootstrap 5
- ES6+ features

## Related Components

- `DeleteModal` - Specialized modal for delete confirmations
- `Button` - Use with modal trigger buttons


