# Document Administration Test Suite

## Overview

This comprehensive test suite covers all aspects of ShareDo's Document Administration Portal, providing thorough testing of document template management, analytics, security, and administrative functionality.

## Test Architecture

### Structure
```
tests/documents/
├── config/
│   └── document-admin-config.ts      # Configuration for document admin tests
├── pages/
│   └── document-admin-page.ts        # Page Object Model for admin portal
├── document-admin-navigation.spec.ts  # Portal navigation and access tests
├── document-template-management.spec.ts # Document template specific tests
├── template-analytics.spec.ts        # All template types analytics tests
├── document-admin-security.spec.ts   # Security and permissions tests
└── DOCUMENT_ADMIN_TESTS.md          # This documentation
```

### Page Object Model

The `DocumentAdminPage` class provides comprehensive interaction methods:

#### Navigation Methods
- `loginAndNavigate()` - Complete login and portal access
- `navigate()` - Direct portal navigation
- `waitForPageLoad()` - Wait for complete portal loading

#### Assertion Methods
- `assertOnDocumentAdminPortal()` - Verify portal access
- `assertMainUsageSectionsVisible()` - Check main analytics sections
- `assertUserAnalyticsSectionsVisible()` - Check user-specific analytics
- `assertTimeAnalyticsSectionsVisible()` - Check time-based analytics
- `assertAllDashboardSectionsPresent()` - Verify complete dashboard
- `assertNoErrors()` - Check for error states

#### Analytics Methods
- `getAnalyticsData(sectionName)` - Extract analytics data
- `getAllUsageStatistics()` - Get all template usage statistics
- `waitForAnalyticsDataLoad()` - Wait for analytics loading

#### Security Methods
- `checkAdminPermissions()` - Verify admin access rights
- `logout()` - Secure logout from portal
- `assertLogoutSucceeded()` - Verify logout success

## Test Categories

### 1. Navigation Tests (`document-admin-navigation.spec.ts`)
- **Portal Access**: Verify successful portal access
- **Dashboard Sections**: Check all analytics sections are visible
- **Authentication**: Test login/logout functionality
- **Direct URL Access**: Test portal access patterns
- **Session Management**: Verify session persistence
- **Performance**: Check portal loading performance

**Key Scenarios:**
- Successful portal access after authentication
- All 12 analytics sections visible and functional
- Direct URL access with proper redirects
- Session maintenance across page interactions
- Logout functionality and security

### 2. Document Template Management (`document-template-management.spec.ts`)
- **Template Usage Analytics**: Document template specific analytics
- **User Analytics**: Document template usage by user
- **Time Analytics**: Document template usage over time
- **Section Interactions**: Click and navigation testing
- **Data Verification**: Analytics data structure validation
- **Search Functionality**: Template search capabilities
- **State Management**: View state persistence
- **Accessibility**: Keyboard navigation and focus management
- **Performance**: Template analytics loading performance

**Key Scenarios:**
- Document template usage analytics display
- User-specific document template analytics
- Time-based document template trends
- Section navigation and interaction
- Search functionality (if available)
- Analytics data consistency

### 3. Template Analytics (`template-analytics.spec.ts`)
Comprehensive testing of all template types:

#### Content Block Management
- Content block usage analytics
- User-specific content block analytics
- Time-based content block analytics
- Section interaction testing

#### Email Template Management
- Email template usage analytics
- User-specific email template analytics
- Time-based email template analytics
- Section interaction testing

#### SMS Template Management
- SMS template usage analytics
- User-specific SMS template analytics
- Time-based SMS template analytics
- Section interaction testing

#### Cross-Template Analytics
- Comparison across all template types
- Navigation between template types
- Analytics data consistency
- Search functionality across types
- Performance testing
- Screenshot documentation

**Key Scenarios:**
- All 4 template types (Document, Content Block, Email, SMS)
- User-specific analytics for each type
- Time-based analytics for each type
- Cross-template navigation and comparison
- Analytics data structure validation
- Performance testing across all sections

### 4. Security & Permissions (`document-admin-security.spec.ts`)
Comprehensive security testing:

#### Authentication & Access Control
- Portal requires authentication
- Proper access after authentication
- Session maintenance across navigation
- Session timeout handling
- Post-logout access prevention

#### Permission Verification
- Document admin permission validation
- Access to all analytics sections
- Section interaction permissions
- Navigation permission testing

#### Security Headers & Protection
- Response header verification
- Unauthorized access protection
- Malformed URL handling
- Path traversal protection

#### Data Protection & Privacy
- Sensitive data exposure prevention
- Analytics data access controls
- Session security validation

#### Error Handling & Security
- Authentication error handling
- Portal error handling without data exposure
- Concurrent access security
- Session isolation testing

#### Audit & Monitoring
- Admin portal access tracking
- Admin action logging
- Audit trail verification

**Key Scenarios:**
- Authentication bypass protection
- Proper permission controls
- Security header validation
- Data privacy protection
- Error handling security
- Audit logging functionality

## Configuration

### Environment Variables
```typescript
BASE_URL=https://core1-release.sharedo.co.uk
TEST_USERNAME=pwshizz
TEST_PASSWORD=q4ruleZZZ
```

### Timeouts
- Navigation: 30 seconds
- Interaction: 10 seconds
- Upload: 60 seconds

## Running Tests

### All Document Admin Tests
```bash
npx playwright test tests/documents --headed
```

### Specific Test Categories
```bash
# Navigation tests only
npx playwright test tests/documents/document-admin-navigation.spec.ts

# Template management tests
npx playwright test tests/documents/document-template-management.spec.ts

# Analytics tests
npx playwright test tests/documents/template-analytics.spec.ts

# Security tests
npx playwright test tests/documents/document-admin-security.spec.ts
```

### With Specific Browsers
```bash
npx playwright test tests/documents --project=chromium --headed
```

## Test Coverage

### Functional Coverage
- ✅ Portal authentication and access
- ✅ All 12 analytics dashboard sections
- ✅ Document template management
- ✅ Content block analytics
- ✅ Email template analytics
- ✅ SMS template analytics
- ✅ User-specific analytics
- ✅ Time-based analytics
- ✅ Cross-template navigation
- ✅ Search functionality
- ✅ Session management

### Security Coverage
- ✅ Authentication controls
- ✅ Authorization verification
- ✅ Session security
- ✅ Access control bypass prevention
- ✅ Data privacy protection
- ✅ Error handling security
- ✅ Audit logging

### Performance Coverage
- ✅ Portal loading performance
- ✅ Analytics data loading
- ✅ Cross-section navigation performance
- ✅ Session persistence performance

## Analytics Sections Tested

### Main Usage Analytics
1. Document Template Usage
2. Content Block Usage
3. Email Template Usage
4. SMS Template Usage

### User-Specific Analytics
5. Document Template Usage by User
6. Content Block Usage by User
7. Email Template Usage by User
8. SMS Template Usage by User

### Time-Based Analytics
9. Document Template Usage over Time
10. Content Block Usage over Time
11. Email Template Usage over Time
12. SMS Template Usage over Time

## Best Practices Implemented

### Page Object Model (POM)
- All portal interactions encapsulated in `DocumentAdminPage`
- Reusable methods for common operations
- Centralized locator management
- Consistent error handling

### Configuration Management
- Environment-specific configuration
- Centralized timeout management
- Configurable URLs and credentials

### DRY Principles
- Reusable setup in `beforeEach`
- Common assertion methods
- Shared analytics data extraction
- Consistent navigation patterns

### Error Handling
- Comprehensive error checking
- Graceful failure handling
- Detailed error reporting
- Security error validation

### Documentation
- Comprehensive test documentation
- Clear test scenario descriptions
- Implementation examples
- Troubleshooting guidance

## Expected Results

### Successful Test Run
- All navigation tests pass
- All analytics sections accessible
- All template types functional
- Security controls effective
- Performance within acceptable limits

### Common Issues
- Authentication failures: Check credentials
- Timeout issues: Verify network connectivity
- Permission errors: Confirm user has admin rights
- Analytics loading: Wait for data loading completion

## Maintenance

### Regular Updates
- Update locators if UI changes
- Adjust timeouts based on performance
- Update test data as needed
- Review security tests for new threats

### Monitoring
- Track test execution times
- Monitor failure patterns
- Review security test results
- Update documentation as needed

This comprehensive test suite ensures the Document Administration Portal meets all functional, security, and performance requirements while providing maintainable and reliable test automation. 