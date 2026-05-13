# Contributing to WeatherDash

Thank you for considering contributing to WeatherDash. This document outlines the guidelines and workflow for contributions.

## Code of Conduct

By participating, you agree to maintain a respectful, inclusive environment for everyone.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/weatherdash.git
   cd weatherdash
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run tests to verify the baseline:
   ```bash
   npm test
   ```

## Development Workflow

### Branch Naming

Use descriptive branch names prefixed by category:

- `feature/` — new features (e.g., `feature/hourly-forecast`)
- `fix/` — bug fixes (e.g., `fix/timezone-missing`)
- `docs/` — documentation improvements (e.g., `docs/api-examples`)
- `refactor/` — code refactoring (e.g., `refactor/weather-client`)

### Commit Messages

Write clear, conventional commit messages:

```
type: short description (≤72 chars)

Optional body explaining motivation and trade-offs.
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode during development
npm run test:watch
```

Tests use Node.js built-in `node:test` — no additional test framework needed.

### Code Style

- **Formatting**: Standard JavaScript — 2-space indentation, semicolons, single quotes
- **Naming**: `camelCase` for variables and functions, `UPPER_SNAKE_CASE` for constants
- **Error Handling**: Always handle promise rejections with try/catch or `.catch()`
- **Comments**: Document *why*, not *what*. Code should be self-documenting.

### Project Structure

```
weatherdash/
├── src/
│   ├── server.js      # Express routes and app setup
│   └── weather.js     # Open-Meteo API client
├── views/             # EJS templates (server-rendered)
├── test/              # Test files
├── screenshots/       # Screenshots for README
├── CONTRIBUTING.md
└── README.md
```

## Adding a New Feature

1. Create a branch from `master`
2. Implement the feature with tests
3. Ensure all existing tests pass
4. Update documentation (README, API docs)
5. Open a Pull Request

## Reporting Bugs

Open an issue with:

- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Node.js version and OS

## Pull Request Process

1. Update README.md with details of changes if applicable
2. Update tests to cover new behavior
3. Ensure the test suite passes
4. Request review from a maintainer
5. PRs require at least one approval before merging

## Code Review

All submissions require review. Reviewers will check:

- Correctness — does the code do what it says?
- Edge cases — null inputs, timeouts, API failures
- Test coverage — are there tests for the change?
- Documentation — are APIs and behavior documented?
