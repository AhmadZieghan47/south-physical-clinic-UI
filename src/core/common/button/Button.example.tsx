/**
 * Button Component Usage Examples
 * 
 * This file demonstrates all available button variants and configurations.
 * Use these examples as a reference when implementing buttons throughout the application.
 */

import React from "react";
import { Button, IconButton } from "./index";

const ButtonExamples: React.FC = () => {
  return (
    <div className="page-wrapper">
      <div className="content">
        <h2 className="mb-4">Button Component Examples</h2>

        {/* Default Buttons */}
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title">Default Buttons</h5>
          </div>
          <div className="card-body">
            <div className="d-flex align-items-center flex-wrap gap-2">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="success">Success</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="warning">Warning</Button>
              <Button variant="info">Info</Button>
              <Button variant="light">Light</Button>
              <Button variant="dark">Dark</Button>
            </div>
          </div>
        </div>

        {/* Outline Buttons */}
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title">Outline Buttons</h5>
          </div>
          <div className="card-body">
            <div className="d-flex align-items-center flex-wrap gap-2">
              <Button variant="primary" styleVariant="outline">Primary</Button>
              <Button variant="secondary" styleVariant="outline">Secondary</Button>
              <Button variant="success" styleVariant="outline">Success</Button>
              <Button variant="danger" styleVariant="outline">Danger</Button>
              <Button variant="warning" styleVariant="outline">Warning</Button>
              <Button variant="info" styleVariant="outline">Info</Button>
            </div>
          </div>
        </div>

        {/* Soft Buttons */}
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title">Soft Buttons</h5>
          </div>
          <div className="card-body">
            <div className="d-flex align-items-center flex-wrap gap-2">
              <Button variant="primary" styleVariant="soft">Primary</Button>
              <Button variant="secondary" styleVariant="soft">Secondary</Button>
              <Button variant="success" styleVariant="soft">Success</Button>
              <Button variant="danger" styleVariant="soft">Danger</Button>
              <Button variant="warning" styleVariant="soft">Warning</Button>
              <Button variant="info" styleVariant="soft">Info</Button>
            </div>
          </div>
        </div>

        {/* Gradient Buttons */}
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title">Gradient Buttons</h5>
          </div>
          <div className="card-body">
            <div className="d-flex align-items-center flex-wrap gap-2">
              <Button variant="primary" styleVariant="gradient">Primary</Button>
              <Button variant="secondary" styleVariant="gradient">Secondary</Button>
              <Button variant="success" styleVariant="gradient">Success</Button>
              <Button variant="danger" styleVariant="gradient">Danger</Button>
            </div>
          </div>
        </div>

        {/* Gradient 2 Buttons */}
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title">Gradient 2 Buttons</h5>
          </div>
          <div className="card-body">
            <div className="d-flex align-items-center flex-wrap gap-2">
              <Button variant="primary" styleVariant="gradient2">Primary</Button>
              <Button variant="secondary" styleVariant="gradient2">Secondary</Button>
              <Button variant="success" styleVariant="gradient2">Success</Button>
              <Button variant="danger" styleVariant="gradient2">Danger</Button>
            </div>
          </div>
        </div>

        {/* Rounded Buttons */}
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title">Rounded Buttons</h5>
          </div>
          <div className="card-body">
            <div className="d-flex align-items-center flex-wrap gap-2">
              <Button variant="primary" rounded>Primary</Button>
              <Button variant="secondary" rounded>Secondary</Button>
              <Button variant="success" rounded>Success</Button>
              <Button variant="danger" rounded>Danger</Button>
            </div>
          </div>
        </div>

        {/* Animation Buttons */}
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title">Animation Buttons</h5>
          </div>
          <div className="card-body">
            <div className="d-flex align-items-center flex-wrap gap-2">
              <Button variant="primary" animation>Primary</Button>
              <Button variant="secondary" animation>Secondary</Button>
              <Button variant="success" animation>Success</Button>
              <Button variant="danger" animation>Danger</Button>
            </div>
          </div>
        </div>

        {/* Buttons with Icons (Left) */}
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title">Buttons with Icons (Left)</h5>
          </div>
          <div className="card-body">
            <div className="d-flex align-items-center flex-wrap gap-2">
              <Button variant="primary" icon={<i className="ti ti-mood-smile" />}>
                Primary
              </Button>
              <Button variant="success" icon={<i className="ti ti-checks" />}>
                Success
              </Button>
              <Button variant="danger" icon={<i className="ti ti-trash" />}>
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Buttons with Icons (Right) */}
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title">Buttons with Icons (Right)</h5>
          </div>
          <div className="card-body">
            <div className="d-flex align-items-center flex-wrap gap-2">
              <Button variant="primary" icon={<i className="ti ti-arrow-right" />} iconPosition="right">
                Next
              </Button>
              <Button variant="success" icon={<i className="ti ti-download" />} iconPosition="right">
                Download
              </Button>
            </div>
          </div>
        </div>

        {/* Label Buttons */}
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title">Label Buttons</h5>
          </div>
          <div className="card-body">
            <div className="d-flex align-items-center flex-wrap gap-2">
              <Button variant="primary" icon={<i className="ti ti-mood-smile" />} labelIcon>
                Primary
              </Button>
              <Button variant="warning" icon={<i className="ti ti-alert-triangle" />} labelIcon>
                Warning
              </Button>
              <Button variant="success" icon={<i className="ti ti-checks" />} labelIcon rounded>
                Success Rounded
              </Button>
              <Button variant="primary" icon={<i className="ti ti-mood-smile" />} labelIcon iconPosition="right">
                Right Icon
              </Button>
            </div>
          </div>
        </div>

        {/* Button Sizes */}
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title">Button Sizes</h5>
          </div>
          <div className="card-body">
            <div className="d-flex flex-wrap align-items-center gap-2">
              <Button variant="primary" size="lg">Large</Button>
              <Button variant="success" size="md">Normal</Button>
              <Button variant="danger" size="sm">Small</Button>
            </div>
          </div>
        </div>

        {/* Icon-Only Buttons */}
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title">Icon-Only Buttons</h5>
          </div>
          <div className="card-body">
            <div className="d-flex align-items-center flex-wrap gap-2">
              <IconButton 
                variant="primary" 
                iconName="bell" 
                ariaLabel="Notifications"
              />
              <IconButton 
                variant="secondary" 
                iconName="mail" 
                ariaLabel="Messages"
              />
              <IconButton 
                variant="info" 
                iconName="pencil" 
                ariaLabel="Edit"
              />
              <IconButton 
                variant="danger" 
                iconName="trash-2" 
                ariaLabel="Delete"
              />
            </div>
          </div>
        </div>

        {/* Icon-Only Outline Buttons */}
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title">Icon-Only Outline Buttons</h5>
          </div>
          <div className="card-body">
            <div className="d-flex align-items-center flex-wrap gap-2">
              <IconButton 
                variant="primary" 
                styleVariant="outline"
                iconName="bell" 
                ariaLabel="Notifications"
              />
              <IconButton 
                variant="secondary" 
                styleVariant="outline"
                iconName="mail" 
                ariaLabel="Messages"
              />
              <IconButton 
                variant="info" 
                styleVariant="outline"
                iconName="pencil" 
                ariaLabel="Edit"
              />
              <IconButton 
                variant="danger" 
                styleVariant="outline"
                iconName="trash-2" 
                ariaLabel="Delete"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title">Loading State</h5>
          </div>
          <div className="card-body">
            <div className="d-flex align-items-center flex-wrap gap-2">
              <Button variant="primary" loading>Saving...</Button>
              <Button variant="success" loading>Processing...</Button>
              <Button variant="danger" loading>Deleting...</Button>
            </div>
          </div>
        </div>

        {/* Disabled State */}
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title">Disabled State</h5>
          </div>
          <div className="card-body">
            <div className="d-flex align-items-center flex-wrap gap-2">
              <Button variant="primary" disabled>Disabled</Button>
              <Button variant="success" disabled>Disabled</Button>
              <Button variant="danger" disabled>Disabled</Button>
            </div>
          </div>
        </div>

        {/* Block Buttons */}
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title">Block Buttons (Full Width)</h5>
          </div>
          <div className="card-body">
            <div className="d-grid gap-2">
              <Button variant="primary" size="sm">Small Block Button</Button>
              <Button variant="warning">Normal Block Button</Button>
            </div>
          </div>
        </div>

        {/* Interactive Examples */}
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title">Interactive Examples</h5>
          </div>
          <div className="card-body">
            <div className="d-flex align-items-center flex-wrap gap-2">
              <Button 
                variant="primary" 
                onClick={() => alert('Primary button clicked!')}
              >
                Click Me
              </Button>
              <Button 
                variant="success" 
                icon={<i className="ti ti-download" />}
                onClick={() => alert('Download started!')}
              >
                Download
              </Button>
              <IconButton 
                variant="danger" 
                iconName="trash-2" 
                ariaLabel="Delete item"
                onClick={() => confirm('Are you sure you want to delete?')}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ButtonExamples;

