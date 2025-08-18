# Contributing to Hasura GraphQL Chat Application

Thank you for your interest in contributing to this project! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- Basic knowledge of React, TypeScript, and GraphQL
- Familiarity with Hasura and n8n (helpful but not required)

### Development Setup

1. **Fork and clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/hasura-chat-app.git
   cd hasura-chat-app
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up your development environment**
   - Update configuration in \`lib/constants.ts\`
   - Ensure you have access to the required services (Hasura, n8n, etc.)

4. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

## 📋 Code Standards

### TypeScript
- Use strict TypeScript configuration
- Define proper interfaces and types in \`lib/types.ts\`
- Avoid \`any\` types - use proper typing
- Use meaningful variable and function names

### React Components
- Use functional components with hooks
- Follow the single responsibility principle
- Extract reusable logic into custom hooks
- Use proper prop typing with interfaces

### Code Organization
- Keep components small and focused
- Use the established folder structure:
  - \`components/\` - Reusable UI components
  - \`lib/\` - Utilities, services, and business logic
  - \`app/\` - Next.js app router pages and layouts

### Styling
- Use Tailwind CSS for styling
- Follow the established design system
- Ensure responsive design (mobile-first)
- Use semantic HTML elements

## 🧪 Testing Guidelines

### Manual Testing
- Test all user flows (login, chat creation, messaging)
- Verify responsive design on different screen sizes
- Test error scenarios (network failures, invalid inputs)
- Check accessibility with screen readers

### Code Quality
- Run the linter before committing: \`npm run lint\`
- Format code with Prettier: \`npm run format\`
- Ensure TypeScript compilation: \`npm run type-check\`

## 📝 Commit Guidelines

### Commit Message Format
Use conventional commits format:
\`\`\`
type(scope): description

[optional body]

[optional footer]
\`\`\`

### Types
- \`feat\`: New feature
- \`fix\`: Bug fix
- \`docs\`: Documentation changes
- \`style\`: Code style changes (formatting, etc.)
- \`refactor\`: Code refactoring
- \`test\`: Adding or updating tests
- \`chore\`: Maintenance tasks

### Examples
\`\`\`
feat(chat): add auto-naming functionality for new chats
fix(auth): resolve login form validation issue
docs(readme): update installation instructions
refactor(components): extract message bubble into separate component
\`\`\`

## 🔄 Pull Request Process

### Before Submitting
1. **Create a feature branch**
   \`\`\`bash
   git checkout -b feature/your-feature-name
   \`\`\`

2. **Make your changes**
   - Follow the code standards above
   - Add appropriate documentation
   - Test your changes thoroughly

3. **Commit your changes**
   \`\`\`bash
   git add .
   git commit -m "feat(scope): your descriptive message"
   \`\`\`

4. **Push to your fork**
   \`\`\`bash
   git push origin feature/your-feature-name
   \`\`\`

### Pull Request Template
When creating a PR, include:

- **Description**: What does this PR do?
- **Type of Change**: Bug fix, new feature, documentation, etc.
- **Testing**: How was this tested?
- **Screenshots**: For UI changes
- **Breaking Changes**: Any breaking changes?

### Review Process
- All PRs require at least one review
- Address feedback promptly
- Keep PRs focused and reasonably sized
- Update documentation if needed

## 🐛 Bug Reports

### Before Reporting
- Check existing issues to avoid duplicates
- Try to reproduce the bug consistently
- Test with the latest version

### Bug Report Template
\`\`\`markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. iOS]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]

**Additional context**
Any other context about the problem.
\`\`\`

## 💡 Feature Requests

### Before Requesting
- Check if the feature already exists
- Consider if it fits the project's scope
- Think about implementation complexity

### Feature Request Template
\`\`\`markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions you've considered.

**Additional context**
Any other context or screenshots.
\`\`\`

## 📚 Development Resources

### Key Technologies
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Hasura Documentation](https://hasura.io/docs/)

### Project-Specific Resources
- [GraphQL Queries](./lib/graphql.ts) - All GraphQL operations
- [Type Definitions](./lib/types.ts) - TypeScript interfaces
- [Utility Functions](./lib/utils/) - Helper functions
- [Component Library](./components/) - Reusable components

## 🤝 Community Guidelines

### Be Respectful
- Use inclusive language
- Be constructive in feedback
- Help newcomers learn
- Respect different perspectives

### Communication
- Use clear, concise language
- Provide context for your suggestions
- Ask questions when unsure
- Share knowledge and resources

## 📞 Getting Help

- **Documentation**: Check the README and code comments
- **Issues**: Search existing issues or create a new one
- **Discussions**: Use GitHub Discussions for questions
- **Code Review**: Ask for help in your PR

Thank you for contributing to making this project better! 🎉
