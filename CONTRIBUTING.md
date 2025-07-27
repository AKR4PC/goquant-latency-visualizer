# Contributing to GoQuant Latency Visualizer

Thank you for your interest in contributing to GoQuant Latency Visualizer! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager
- Git
- Modern web browser with WebGL support

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/AKR4PC/goquant-latency-visualizer.git
   cd goquant-latency-visualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Development Guidelines

### Code Style
- Use **TypeScript** for all new code
- Follow **ESLint** and **Prettier** configurations
- Use **meaningful variable and function names**
- Add **JSDoc comments** for complex functions
- Follow **React best practices** and hooks patterns

### Commit Messages
Use conventional commit format:
```
type(scope): description

feat(globe): add new exchange marker animations
fix(charts): resolve latency data rendering issue
docs(readme): update installation instructions
style(ui): improve button hover effects
refactor(hooks): optimize theme switching logic
test(services): add latency service unit tests
```

### Branch Naming
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/documentation-update` - Documentation changes
- `refactor/component-name` - Code refactoring
- `style/ui-improvements` - UI/UX improvements

## 🎯 Types of Contributions

### 🐛 Bug Reports
When reporting bugs, please include:
- **Clear description** of the issue
- **Steps to reproduce** the problem
- **Expected vs actual behavior**
- **Browser and OS information**
- **Screenshots or videos** if applicable
- **Console errors** if any

### ✨ Feature Requests
For new features, please provide:
- **Clear description** of the proposed feature
- **Use case and benefits**
- **Mockups or wireframes** if applicable
- **Technical considerations**
- **Breaking changes** if any

### 🔧 Code Contributions

#### Before Starting
1. **Check existing issues** to avoid duplicates
2. **Create an issue** to discuss major changes
3. **Fork the repository** and create a feature branch
4. **Follow coding standards** and guidelines

#### Development Process
1. **Write clean, documented code**
2. **Add tests** for new functionality
3. **Update documentation** as needed
4. **Test thoroughly** across different browsers
5. **Ensure responsive design** works on all devices

#### Pull Request Process
1. **Update README.md** if needed
2. **Add/update tests** for your changes
3. **Ensure all tests pass**
4. **Update documentation**
5. **Create detailed PR description**

## 🧪 Testing

### Running Tests
```bash
npm run test          # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

### Testing Guidelines
- Write **unit tests** for utilities and services
- Add **component tests** for React components
- Include **integration tests** for complex features
- Test **responsive behavior** on different screen sizes
- Verify **accessibility** compliance

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
├── components/            # React components
│   ├── 3d/               # 3D visualization components
│   ├── charts/           # Chart components
│   └── ui/               # UI components
├── data/                 # Static data
├── hooks/                # Custom React hooks
├── services/             # API and data services
├── types/                # TypeScript definitions
└── utils/                # Utility functions
```

## 🎨 Design Guidelines

### UI/UX Principles
- **Consistency** in design patterns
- **Accessibility** for all users
- **Performance** optimization
- **Mobile-first** responsive design
- **Dark/light mode** support

### Component Guidelines
- Use **TypeScript interfaces** for props
- Implement **proper error boundaries**
- Add **loading states** for async operations
- Include **accessibility attributes**
- Follow **React best practices**

## 🌐 Internationalization

When adding text content:
- Use **semantic keys** for translations
- Support **RTL languages** where applicable
- Consider **cultural differences** in design
- Test with **different text lengths**

## 📊 Performance Guidelines

### 3D Visualization
- **Optimize geometry** complexity
- **Use efficient materials** and textures
- **Implement LOD** (Level of Detail) when needed
- **Monitor frame rates** and memory usage
- **Test on lower-end devices**

### General Performance
- **Lazy load** components when possible
- **Optimize images** and assets
- **Use React.memo** for expensive components
- **Implement proper caching** strategies
- **Monitor bundle size**

## 🔒 Security Guidelines

- **Validate all inputs** on client and server
- **Sanitize user data** before rendering
- **Use HTTPS** for all external requests
- **Implement proper CSP** headers
- **Keep dependencies updated**

## 📖 Documentation

### Code Documentation
- Add **JSDoc comments** for functions
- Document **complex algorithms**
- Explain **business logic** decisions
- Include **usage examples**

### README Updates
- Keep **installation instructions** current
- Update **feature descriptions**
- Add **screenshots** for new features
- Maintain **API documentation**

## 🤝 Community Guidelines

### Code of Conduct
- Be **respectful** and inclusive
- **Help others** learn and grow
- **Provide constructive** feedback
- **Celebrate contributions** from all skill levels

### Communication
- Use **clear, professional** language
- **Ask questions** when unsure
- **Share knowledge** and resources
- **Be patient** with newcomers

## 🏆 Recognition

Contributors will be recognized in:
- **README.md** contributors section
- **Release notes** for significant contributions
- **GitHub contributors** page
- **Special mentions** in project updates

## 📞 Getting Help

- **GitHub Issues** - For bugs and feature requests
- **GitHub Discussions** - For questions and ideas
- **Discord/Slack** - For real-time chat (if available)
- **Email** - For private concerns

## 🔄 Release Process

### Version Numbering
We follow [Semantic Versioning](https://semver.org/):
- **MAJOR** - Breaking changes
- **MINOR** - New features (backward compatible)
- **PATCH** - Bug fixes (backward compatible)

### Release Checklist
- [ ] Update version in package.json
- [ ] Update CHANGELOG.md
- [ ] Run full test suite
- [ ] Update documentation
- [ ] Create release notes
- [ ] Tag release in Git

## 📝 License

By contributing to GoQuant Latency Visualizer, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to GoQuant Latency Visualizer! 🚀