# ShareDo Project Context

> **For AI assistants writing Playwright tests: See [TESTING_CONTEXT.md](./TESTING_CONTEXT.md) for practical testing guidance, code templates, and implementation details.**

## Core Philosophy & Purpose

**ShareDo has one objective, one purpose and one focus: To manage work.**

ShareDo is not a document management system, CRM, or general business application. It is purpose-built with a singular focus: optimizing how work moves from one stage to another.

> *"Every line of code, every design decision and every user interaction is designed to streamline and optimise how work moves from one stage to another."*

## Definition of "Work" in ShareDo

**Work** is any process that has:
1. **A defined start point**
2. **A defined end point** 
3. **Any number of stages and activities between those two points**

### Work Characteristics
- **Flexibility**: Work does not have to be predictable
- **Artisanal Support**: ShareDo supports work that is largely unpredictable and creative
- **Prescriptive Support**: ShareDo also supports highly structured, predictable work
- **Scalability**: Work can be simple single processes or complex multi-stage operations
- **Connectivity**: Work types can feed into other work types
- **Nesting**: Work can contain sub-work types within larger work processes

### Examples of Work Types (Legal Industry Context)

#### Primary Work Types
1. **Matter Management** (Most Common)
   - Full legal case lifecycle from inception to completion
   - Complex, multi-stage process with unpredictable elements
   - Contains multiple sub-work types and activities

#### Supporting Work Types
2. **Matter Inception**
   - Process: Potential matter identification → successful onboarding
   - Feeds into: Matter management work type (if successful)
   - Stages: Lead qualification, conflict checking, client onboarding

3. **Fee/Estimate Quoting System**
   - Process: Client enquiry → fee establishment → quote submission → acceptance/rejection
   - Integration: Client portals, automated/manual fee calculation
   - Feeds into: Matter management (for accepted quotes)

4. **Job Triaging & Management**
   - Process: Discrete task assignment to legal delivery centers
   - Examples: PowerPoint preparation, proofreading, document production
   - Can be: Independent work OR sub-work within matter management

5. **Contract Collaboration**
   - Process: Document preparation → negotiation → signature
   - Focus: Collaborative workflow management
   - Involves: Multiple parties, version control, approval processes

6. **Incident Management**
   - Process: Incident identification → investigation → resolution
   - Scope: Can be upstream from legal work
   - Application: Risk management, compliance, operational issues

#### Work Type Relationships
- **Sequential**: Matter Inception → Matter Management
- **Nested**: Job Triaging within Matter Management
- **Parallel**: Multiple work types running simultaneously
- **Feeding**: One work type creates input for another

## System Overview

### What ShareDo Is
- **Primary Function**: Work management optimization platform
- **Architecture**: Multi-domain cloud-based system
- **Target Users**: Organizations that need to streamline work processes
- **Core Value**: Eliminating friction in work progression

### What ShareDo Is NOT
- **Document management system** (though it integrates with DMS like O365, iManage)
- **CRM system** (though it manages client relationships within work context)
- **Practice management system** (though it integrates with PMS)
- **Email system** (though it augments/replaces Outlook functionality)
- **Accounting system** (though it includes comprehensive financial management)
- **General-purpose business application** (every feature is work-management focused)

ShareDo is a **comprehensive work management platform** that integrates with and enhances existing business systems while maintaining its singular focus on optimizing how work moves through organizations.

## Technical Architecture

### Domain Structure
- **Main Application**: `core1-release.sharedo.co.uk`
- **Identity Service**: `core1-release-identity.sharedo.co.uk`
- **Help Documentation**: `help.sharedo.co.uk`

### ShareDo Platform Architecture

ShareDo is a comprehensive work management platform with these key components:

#### **Work Types vs Work Items**
- **Work Type**: A template/definition that defines a process (e.g., "Instruction", "RTA - Claimant")
- **Work Item**: An actual instance created from a work type (e.g., a specific instruction case)
- **Relationship**: Work types are templates; work items are the actual work being performed

#### **Blade Architecture**
- **Blades**: UI panels that open on the right side for work item interactions
- **Aspects**: Each blade is composed of "aspects" defined against the work type
- **Aspect Structure**:
  - **UI Component**: Defines the visual interface and form elements
  - **Server-side Code**: Handles data loading and saving for that aspect
  - **Modularity**: Each aspect is responsible for its own data lifecycle

#### **Core Work Management**
- **Work Type Modelling** - Define work processes, SLAs, participants, and aspects
- **Work Management** - Allocation, tracking, automation, team capacity  
- **Workflow Automation** - Complex event processing and work progression
- **Work Collaboration** - Internal/external collaboration tools

#### **Supporting Systems**
- **Document Management** - Templates, production, assembly, DMS integration
- **Financial Management** - Case accounting, time recording, profitability
- **Matter Intake & CMI** - Client onboarding, compliance processes
- **Email Management** - Outlook integration, automated routing
- **Personas & Portals** - Customized experiences for employees/clients/partners
- **Business Intelligence** - Analytics, reporting, "radar" visualizations

#### **Platform Infrastructure**
- **Security & Compliance** - GDPR, access controls, audit trails
- **Application Integration** - Pre-built connectors, extensibility framework
- **Solution Accelerators** - Pre-configured work types for legal/professional services
- **Data Migration** - Legacy system integration capabilities

## Testing Philosophy

**Core Principle**: Test how ShareDo optimizes work progression, not just feature functionality.

### Testing Focus Areas
1. **Work Lifecycle Validation** - Start points, stages, end points, transitions
2. **Work Type Flexibility** - Both structured and artisanal work patterns  
3. **Work Relationships** - Sequential, nested, parallel, and feeding work types
4. **Work Optimization** - Templates, automation, visibility, and efficiency
5. **Platform Integration** - How ShareDo enhances existing business systems

> **Detailed testing guidance, patterns, and code templates: [TESTING_CONTEXT.md](./TESTING_CONTEXT.md)**

### Testing Categories

#### **Current Implementation**
- ✅ **Authentication** (`tests/auth/`) - Login, security, access controls
- ✅ **Document Administration** (`tests/documents/`) - Template management, analytics

#### **High Priority Next**  
- 🔥 **Work Type Modelling** - Work process definition and SLA configuration
- 🔥 **Work Management** - Allocation, tracking, team capacity optimization
- 🔥 **Workflow Automation** - Process automation and work progression

#### **Future Categories**
- Financial Management, Matter Intake/CMI, Email Management, Work Collaboration, Personas & Portals, Business Intelligence, Integrations, Security & Compliance, Solution Accelerators, Data Migration

> **Complete category details, priorities, and test specifications: [TESTING_CONTEXT.md](./TESTING_CONTEXT.md)**

## Business Context

### Industry Focus
Organizations where complex work management is critical:
- Legal firms (matter/case management)
- Professional services (project management)  
- Financial services (process management)
- Any organization with multi-stage work processes

### Key Success Metrics
- **Work Optimization**: Velocity, quality, visibility, efficiency
- **Platform Performance**: SLA compliance, resource utilization, automation effectiveness
- **Business Impact**: Financial performance, client satisfaction, integration success

## Technical Configuration

- **Environment**: `https://core1-release.sharedo.co.uk` (main) + `https://core1-release-identity.sharedo.co.uk` (auth)
- **Test User**: `pwshizz` / `q4ruleZZZ`
- **Current Tests**: Authentication (`tests/auth/`) + Document Administration (`tests/documents/`)

---

## For Test Development

**See [TESTING_CONTEXT.md](./TESTING_CONTEXT.md) for:**
- Practical testing patterns and code templates
- Technical implementation guidance  
- Page object model standards
- Configuration and environment setup
- Selector strategies and best practices
- Detailed test category specifications
- Common anti-patterns to avoid
- Work-focused testing strategies

*This document provides business context; TESTING_CONTEXT.md provides comprehensive testing guidance (formerly TEST_RULES.md).* 