# ShareDo Testing Context for AI Assistants

## Core Testing Philosophy

**ShareDo's Single Purpose**: Optimize how work moves from start → stages → end
**Testing Focus**: Validate work progression efficiency, not feature completeness

## Reusable Component Architecture (MANDATORY)

**Principle**: Extract common concerns into static helper methods to minimize test setup code

### Common Concerns to Extract:
- ✅ **Authentication**: Login/logout flows
- ✅ **Navigation**: Complex multi-step navigation paths  
- ✅ **Diagnostics**: Error checking, logging, debugging utilities
- ✅ **Data Setup**: Creating test data, seeding databases
- ✅ **Environment Preparation**: Browser state, cookies, local storage
- ✅ **Cleanup**: Teardown operations, data cleanup

### Implementation Pattern:
```typescript
// ✅ GOOD: Static helper methods for common concerns
class LoginPage {
  static async performLogin(page: Page): Promise<void> {
    // All login logic encapsulated - navigate, fill, submit, verify
  }
}

class DiagnosticsHelper {
  static async captureDebugInfo(page: Page, testName: string): Promise<void> {
    // Screenshot, console logs, network requests, page state, etc.
  }
}

class NavigationHelper {
  static async navigateToWorkTypeEditor(page: Page): Promise<void> {
    // Multi-step navigation: login → admin → work types → editor
  }
  
  static async navigateToDocumentAdmin(page: Page): Promise<void> {
    // Multi-step navigation: login → admin → documents
  }
}

class DataHelper {
  static async createTestWorkType(page: Page, config: WorkTypeConfig): Promise<string> {
    // Create work type and return ID for cleanup
  }
}

// ✅ USAGE: Minimal, focused test setup
test.beforeEach(async ({ page }) => {
  await LoginPage.performLogin(page);
  await NavigationHelper.navigateToWorkTypeEditor(page);
});

test('should create work type with SLA validation', async ({ page }) => {
  // Test focuses purely on business logic, not setup mechanics
  const workTypeId = await DataHelper.createTestWorkType(page, { sla: '24h' });
  // ... test work type SLA behavior
});
```

### Benefits:
- 🧠 **Reduced Cognitive Load**: Tests focus on business logic, not setup details
- 🔧 **Maintainability**: Change setup logic in one place, affects all tests
- 📝 **Readability**: Tests are cleaner and more focused on work optimization
- 🛡️ **Consistency**: Impossible to forget setup steps or get sequence wrong
- ⚡ **DRY Principle**: Single source of truth for common operations
- 🎯 **Work Focus**: More time testing work flows, less time on test mechanics

## Essential ShareDo Knowledge for Testing

### What is "Work" in ShareDo
- **Definition**: Any process with defined start point, end point, and stages between
- **Types**: From simple compliance tasks to complex M&A matters
- **Characteristics**: Can be predictable/structured OR artisanal/unpredictable
- **Relationships**: Work types can be sequential, nested, parallel, or feeding

### Core Platform Components (Testing Perspective)
1. **Authentication** - Multi-domain (identity + main app)
2. **Work Type Modelling** - Define work processes and SLAs
3. **Work Management** - Allocation, tracking, automation
4. **Document Templates** - Standardize work outputs
5. **Analytics** - Work optimization insights
6. **Portals** - Client/employee work interfaces
7. **Integrations** - Connect to existing business systems

## Technical Configuration

### Environment Setup
```typescript
// Configuration from tests/config/test-config.ts
export const testConfig = {
  baseUrl: process.env.BASE_URL || 'https://core1-release.sharedo.co.uk',
  loginIdentityUrl: process.env.LOGIN_IDENTITY_URL || 'https://core1-release-identity.sharedo.co.uk',
  testUser: {
    username: process.env.TEST_USERNAME || 'pwshizz',
    password: process.env.TEST_PASSWORD || 'q4ruleZZZ'
  },
  defaultTimeout: 30000,
  loginTimeout: 10000
};

// Usage in tests
import { testConfig } from './config/test-config';
await page.fill('#username', testConfig.testUser.username);
await page.goto(testConfig.baseUrl);
```

### Environment Variables
- `BASE_URL`: Main application URL  
- `LOGIN_IDENTITY_URL`: Identity service URL
- `TEST_USERNAME`: Test user username
- `TEST_PASSWORD`: Test user password

### Configuration Rules
**Rule**: Centralized test configuration
- All test URLs, credentials, and environment-specific settings MUST be defined in `tests/config/test-config.ts`
- Use environment variables with sensible defaults: `process.env.VARIABLE_NAME || 'default_value'`
- Never hardcode URLs, usernames, or passwords directly in test files
- Import `testConfig` from the config file in all test files that need these values

### Existing Test Structure
```
tests/
├── auth/              # ✅ Login/logout, security
│   ├── pages/         # Page objects for auth
│   ├── login.spec.ts  # Login functionality tests
│   └── security.spec.ts # Security tests
├── documents/         # ✅ Template administration  
│   ├── pages/         # Page objects for document admin
│   └── *.spec.ts      # Document admin tests
├── shared/            # ✅ Common utilities
│   └── launchpad-page.ts # Shared page objects
└── config/            # ✅ Environment configuration
    └── test-config.ts # Centralized configuration
```

### Recommended File Organization Pattern
```
tests/[category]/
├── pages/
│   └── [category]-page.ts    # Page objects
├── config/                   # Category-specific config (if needed)
│   └── [category]-config.ts
└── [feature].spec.ts         # Test specifications
```

## Testing Patterns & Best Practices

### 1. Page Object Model (Mandatory)
**ALWAYS** use page objects for interactions:

**Rule**: All page-specific interactions MUST be encapsulated in Page Object classes
- Create page objects in `tests/[category]/pages/` directory
- Page objects should contain:
  - Element locators as readonly properties
  - Action methods (fillCredentials, clickLogin, etc.)
  - Assertion methods (assertOnLoginPage, assertLoginSucceeded, etc.)
- Test files should ONLY call page object methods, never direct page interactions

```typescript
// ✅ GOOD - Page object method
await loginPage.loginWithValidCredentials();

// ❌ BAD - Direct page interaction
await page.fill('#username', 'pwshizz');
```

**Page Object Structure:**
```typescript
export class WorkTypePage {
  readonly page: Page;
  readonly nameField: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameField = page.locator('#workTypeName');
    this.saveButton = page.locator('button[type="submit"]');
  }

  async navigate() { /* implementation */ }
  async createWorkType(name: string) { /* implementation */ }
  async assertWorkTypeCreated() { /* implementation */ }
}
```

### 2. Work-Focused Test Names
```typescript
// Good - Work-focused
test('should allow user to access work allocation dashboard')
test('should validate work type SLA configuration')

// Bad - Feature-focused  
test('should display dashboard')
test('should save configuration')
```

### 3. DRY Principles & Code Reusability
**Rule**: Eliminate repetitive test code
- Use `beforeEach` hooks for common setup (navigation, page object initialization)
- Extract common assertions into reusable page object methods
- Group related assertions into single methods (e.g., `assertLoginFailed()`)
- Avoid duplicating navigation, form filling, or assertion logic

```typescript
// ❌ BAD: Repetitive code in each test
test('test 1', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('#username');
  await page.fill('#username', 'user');
  // ... more repetitive setup
});

// ✅ GOOD: Common setup in beforeEach with page objects
test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  await loginPage.navigate();
});

test('test 1', async () => {
  await loginPage.fillCredentials('user', 'pass');
  await loginPage.assertLoginFailed();
});
```

### 4. Authentication Pattern (MANDATORY)
**Rule**: ALWAYS use the existing LoginPage class - never implement custom login logic

```typescript
// ✅ RECOMMENDED: Use simplified static helper (new pattern)
test.beforeEach(async ({ page }) => {
  await LoginPage.performLogin(page);
  // Now logged in and on main work domain
});

// ✅ ACCEPTABLE: Use existing LoginPage pattern (if you need the instance)
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.loginWithValidCredentials();
  await loginPage.assertLoginSucceeded();
  // Now on main work domain
});

// ❌ FORBIDDEN: Custom login implementation
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.fill('#username', 'user');  // Don't do this!
  await page.fill('#password', 'pass');  // Don't do this!
  await page.click('button:has-text("Login")');  // Don't do this!
});
```

**Why this matters**:
- Maintains consistent login behavior across all tests
- Centralizes credential management and environment handling  
- Provides reliable navigation and error handling
- Reduces maintenance burden when login flow changes
- **Exemplifies reusable component architecture** - pattern to follow for all common concerns

### 5. Multi-Domain Navigation Pattern
```typescript
// Identity domain: login/logout
await expect(page).toHaveURL(/.*identity.*sharedo.*login/);

// Main domain: work functionality  
await expect(page).toHaveURL(/.*core1-release\.sharedo\.co\.uk/);
```

### 6. Test Organization & Structure
**Rule**: Clean and maintainable test structure
- Each test should have a single, clear responsibility
- Use descriptive test names that explain the expected behavior
- Group related tests in `test.describe` blocks
- Keep test methods short and focused on the specific scenario
- Use meaningful comments to explain complex test logic

```typescript
test.describe('Work Type Management', () => {
  let workTypePage: WorkTypePage;

  test.beforeEach(async ({ page }) => {
    workTypePage = new WorkTypePage(page);
    await workTypePage.loginAndNavigate();
  });

  test('should create new work type with SLA configuration', async () => {
    await workTypePage.createWorkType('Legal Matter Review');
    await workTypePage.configureSLA('5 days');
    await workTypePage.assertWorkTypeCreated();
  });

  test('should validate work type SLA enforcement', async () => {
    await workTypePage.createWorkType('Urgent Review');
    await workTypePage.configureSLA('1 day');
    await workTypePage.assertSLAEnforcement();
  });
});
```

## Common Testing Scenarios

### Authentication Tests
- ✅ **Implemented**: Basic login/logout, security, session management
- **Focus**: Efficient work access, not security testing for its own sake

### Document Administration Tests  
- ✅ **Implemented**: Template management, analytics, portal access
- **Focus**: Template effectiveness for work standardization

### High Priority Test Areas
1. **Work Type Modelling** - Creating and configuring work types
2. **Work Management** - Work allocation, tracking, SLA management
3. **Workflow Automation** - Process automation and work progression

## Selector Strategies

### ShareDo UI Framework Architecture
**Foundation**: ShareDo is built on KnockoutJS with a custom UI framework that defines specific element types.

**Key UI Element Types**:
- **🔲 Blades**: Panels that open on the right side of screen. Multiple can be opened simultaneously, with newest appearing to the right of previous ones.
  - **Selector**: `div.ui-stack` (contains all open blades)
  - **Use Case**: Instruction forms, detail views, configuration panels
  - **Navigation Pattern**: New blades slide in from right, creating a breadcrumb-like stack

- **📦 Widgets**: Higher-level UI components representing complete functional areas.
  - **Selector**: `div.widget`  
  - **Use Case**: Dashboard sections, main content areas, standalone functional blocks
  - **Architecture**: ShareDo UI framework "things" (not standard KnockoutJS)

- **🧩 Components**: Lower-level reusable UI components used within widgets and blades.
  - **Architecture**: Standard KnockoutJS components
  - **Purpose**: Encapsulate common UI features for reusability across widgets and blades
  - **Examples**: Form controls, data grids, search bars, navigation elements

**Selector Strategy Implications**:
```typescript
// ✅ GOOD: Target specific UI framework elements
const instructionBlade = page.locator('div.ui-stack .blade:last-child'); // Newest blade
const dashboardWidget = page.locator('div.widget[data-widget-type="dashboard"]');
const searchComponent = page.locator('[data-component="search-bar"]');

// ✅ GOOD: Navigate blade stack hierarchy  
const firstBlade = page.locator('div.ui-stack .blade:first-child');
const currentBlade = page.locator('div.ui-stack .blade:last-child'); // Active blade

// ❌ BAD: Ignore UI framework structure
const somePanel = page.locator('div:has(form)'); // Too generic, doesn't leverage framework
```

### Use Flexible Patterns
```typescript
// Good - Flexible regex patterns
await expect(page).toHaveURL(/.*sharedo\.co\.uk/);
await expect(page).toHaveTitle(/worklist|dashboard|home/i);

// Bad - Exact matches (brittle)
await expect(page).toHaveURL('https://core1-release.sharedo.co.uk/dashboard');
```

### Structural Selectors Over Content
```typescript
// ✅ GOOD: Structural selector (position-based)
page.locator('nav.navbar.main .dropdown-toggle').first()

// ❌ BAD: Text-based selector (assumes username = display name)
page.locator('a:has-text("pwshizz")')

// ❌ BAD: Hardcoded display name transformation
page.locator('a:has-text("PW Shizz")')
```

**Why Structural Selectors Are Better:**
- **Resilient**: Work regardless of username or display name changes
- **Maintainable**: Don't break when user data changes
- **Reusable**: Work across different user accounts and environments
- **Predictable**: Based on UI structure, not dynamic content

### Validation Patterns
**ShareDo Validation Message Structure**: Mandatory fields have specific validation patterns that can be leveraged for robust testing.

**Validation Message Pattern**:
```typescript
// Validation messages appear as span elements with specific attributes
<span class="text-danger" data-bind="visible: validation.fieldName, text: validation.fieldName">
  Field specific error message
</span>
```

**Selector Examples**:
```typescript
// ✅ GOOD: Target validation by field relationship
const workTypeValidation = page.locator('.text-danger').filter({ hasText: 'Work Type is required' });
const clientValidation = page.locator('span.text-danger[data-bind*="validation.client"]');

// ✅ GOOD: Check required field state
const allValidationMessages = page.locator('span.text-danger[data-bind*="validation"]');
const visibleValidations = page.locator('span.text-danger:visible');

// ✅ GOOD: Test validation behavior
await field.clear(); // Trigger validation
await expect(validationMessage).toBeVisible();
await field.fill('valid value'); // Clear validation
await expect(validationMessage).not.toBeVisible();

// ❌ BAD: Generic error message selector (too broad)
const errors = page.locator('.error');
```

**Validation Testing Patterns**:
- **Required Field Testing**: Always test that mandatory fields show validation when empty
- **Validation Clearing**: Verify validation messages disappear when field is properly filled
- **Form State Testing**: Use validation visibility to determine if form is ready for submission
- **Field Identification**: Use `data-bind="validation.fieldName"` to reliably identify specific field validations

## Testing Categories & Priorities

### Current Categories
| Category | Status | Focus |
|----------|--------|-------|
| `auth/` | ✅ Complete | Work access efficiency |
| `documents/` | ✅ Complete | Work template standardization |

### Next Priorities
| Priority | Category | Purpose |
|----------|----------|---------|
| 🔥 High | `work-types/` | Work definition and SLA configuration |
| 🔥 High | `work-management/` | Work allocation and tracking |
| 🔥 High | `workflows/` | Work automation and progression |

## Test Development Guidelines

### 1. Category Selection (MANDATORY)
**BEFORE writing any tests, ask user:**
"Which test category should these tests go in? (auth/, documents/, work-types/, work-management/, workflows/, or new category?)"

### 2. Work Context Questions
For any new tests, clarify:
- What work process is being tested?
- How does this feature optimize work progression?
- What work stages/transitions are involved?
- Who are the work participants/stakeholders?

### 3. Test Scope Definition
```typescript
// Each test should validate ONE work aspect
test('should allocate urgent work to available team members'); // Good - specific
test('should manage work correctly'); // Bad - too broad
```

### 4. Assertion Patterns
```typescript
// Work-focused assertions
await workPage.assertWorkAllocatedToCorrectTeam();
await workPage.assertSLATimelineDisplayed();
await workPage.assertWorkProgressionVisible();

// Not just UI validation
await expect(button).toBeVisible(); // Insufficient alone
```

## Common Anti-Patterns to Avoid

### ❌ Testing Features Without Work Context
```typescript
// Bad
test('should display admin portal');

// Good  
test('should display work template administration portal for optimizing document creation workflows');
```

### ❌ Ignoring ShareDo's Work Philosophy
```typescript
// Bad - Generic functionality test
test('should save document template');

// Good - Work optimization test
test('should save document template to standardize legal work outputs and reduce preparation time');
```

### ❌ Brittle Selectors
```typescript
// Bad - Content dependent
page.locator('text=Submit Work Item');

// Good - Structural + functional
page.locator('[data-testid="submit-work-button"]') 
// or if no test IDs available:
page.locator('form[action*="work"] button[type="submit"]');
```

## Code Templates

### Basic Test Structure
```typescript
import { test, expect } from '@playwright/test';
import { WorkTypePage } from './pages/work-type-page';

test.describe('Work Type Management', () => {
  let workTypePage: WorkTypePage;

  test.beforeEach(async ({ page }) => {
    workTypePage = new WorkTypePage(page);
    await workTypePage.loginAndNavigate();
  });

  test('should create new work type with SLA configuration', async () => {
    await workTypePage.createWorkType('Legal Matter Review');
    await workTypePage.configureSLA('5 days');
    await workTypePage.assertWorkTypeCreated();
  });
});
```

### Page Object Template
```typescript
export class WorkTypePage {
  readonly page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }

  async loginAndNavigate() {
    // Login logic
    // Navigate to work type management
  }

  async createWorkType(name: string) {
    // Work type creation logic
  }

  async assertWorkTypeCreated() {
    // Validation that work type enables work optimization
  }
}
```

## Testing Success Criteria

### Functional Success
- Work can be created, progressed, and completed efficiently
- SLAs are enforced and visible
- Work allocation operates correctly
- Templates standardize work outputs effectively

### Technical Success  
- Tests are reliable and maintainable
- Page objects encapsulate all interactions
- Assertions validate work optimization, not just UI state
- Tests follow established patterns

## Quick Reference

### When to Create New Tests
- New work type functionality discovered
- Work progression patterns to validate
- Work optimization features to test
- Integration points affecting work flow

### When to Update Existing Tests
- UI changes affecting existing page objects
- New work features added to existing categories
- Bug fixes requiring test updates
- Performance optimizations to validate

### When to Ask for Clarification
- Unclear which test category to use
- Uncertain about work context/business logic
- Missing technical details for implementation
- Complex work relationships requiring domain knowledge

---

**Remember**: Every test should answer "How does this optimize work progression?" If you can't answer that, reconsider the test's value or ask for work context clarification. 