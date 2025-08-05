# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the EloqData company website built with Docusaurus 3.0. The website showcases EloqData's database products including EloqKV, EloqSQL, EloqDoc, EloqConvergedDB, and EloqCloud. It serves as both a marketing site and comprehensive documentation hub for their database solutions.

## Common Development Commands

### Development and Build
- `yarn start` - Start development server
- `yarn build` - Build production site (includes redirect update)
- `yarn build:fast` - Fast build for preview deployments
- `yarn serve` - Serve built site locally
- `yarn clear` - Clear Docusaurus cache

### Testing and Quality
- `yarn test` - Run tests (currently just builds the site)
- `yarn lint` - Lint JavaScript files
- `yarn lint:examples` - Lint code examples 
- `yarn lint:versioned` - Lint versioned documentation
- `yarn ci:lint` - Full CI linting suite

### Formatting
- `yarn prettier` - Format all source files, markdown, and styles
- `yarn format:source` - Format JavaScript files only
- `yarn format:markdown` - Format markdown files only
- `yarn format:style` - Format SCSS/CSS files only

## Architecture Overview

### Multi-Documentation Structure
The site uses Docusaurus's multi-docs plugin architecture to serve documentation for different products:

- **Main docs** (`/docs`) - Legacy MonoSQL documentation
- **EloqKV** (`/eloqkv`) - Redis-compatible key-value database docs
- **EloqSQL** (`/eloqsql`) - MySQL-compatible distributed SQL database docs  
- **EloqDoc** (`/eloqdoc`) - MongoDB-compatible document database docs
- **EloqCloud** (`/eloqcloud`) - Cloud platform documentation
- **MonoRPC** (`/monorpc`) - RPC framework documentation
- **Chinese versions** (`/eloqsqlcn`, `/monosqlcn`) - Localized documentation

### Key Components Architecture

#### Homepage (`src/pages/index.js`)
- Complex interactive homepage with product matrix visualization
- Circular orbit animation showing product relationships
- Features dynamic content sections and tooltips
- Responsive design with mobile-first approach

#### Documentation Structure
Each product documentation follows consistent patterns:
- Installation/quick-start guides
- Configuration references  
- API compatibility documentation
- Benchmark and performance data
- Migration guides

#### Blog System
- Technical blog posts (`/blog`) with performance benchmarks and deep dives
- News announcements (`/newsposts`) for product updates and events
- Python scripts for regenerating chart images in blog posts

### Styling Architecture
- SCSS-based styling with modular approach
- Dark theme as default (not switchable)
- Custom orange brand color (#ff7b2d) throughout
- Responsive design patterns for mobile/desktop

### Content Management
- Markdown-based content with MDX support
- Automated sidebar generation for each documentation section
- Version management for different product releases
- Custom components for enhanced content presentation

## Development Workflow

### Working with Documentation
1. Documentation is organized by product in separate directories
2. Each product has its own sidebar configuration file
3. Use relative links for internal navigation
4. Images should be placed in appropriate `media/` subdirectories

### Adding New Products/Sections
1. Create new directory under appropriate section
2. Add corresponding sidebar configuration
3. Update `docusaurus.config.js` with new plugin instance
4. Add navigation links to header dropdown menus

### Blog and News Management
- Blog posts use standard Docusaurus blog format
- News posts use custom plugin configuration
- Include appropriate images in post directories
- Use consistent front matter format

### Styling Guidelines
- Follow existing SCSS module patterns
- Maintain dark theme consistency
- Use established color palette and typography
- Ensure mobile responsiveness

## Important Notes

- This is a production marketing website, so maintain high quality standards
- Performance is critical - optimize images and minimize bundle size  
- SEO is important - ensure proper meta tags and structured content
- The site serves both technical documentation and marketing purposes
- Multi-language support is implemented for key sections