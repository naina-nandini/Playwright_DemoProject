# Playwright TypeScript Framework

A production-ready Playwright automation framework built with TypeScript, featuring industry-standard design patterns and best practices.

## 🚀 Features

- **Page Object Model (POM)** - Clean, maintainable test architecture
- **Design Patterns** - Singleton, Factory, Fluent Interface, Template Method
- **Multi-Browser Support** - Chromium, Firefox, WebKit
- **API Testing** - Integrated API test capabilities
- **Visual Testing** - Screenshot comparison and visual regression
- **Custom Reporting** - HTML, JSON, JUnit, and Allure reports
- **CI/CD Ready** - GitHub Actions integration
- **TypeScript** - Type-safe code with IntelliSense
- **Logging** - Winston-based logging system
- **Test Data Factory** - Faker.js integration for realistic test data

## 📁 Project Structure

```
playwright-framework/
├── src/
│   ├── core/
│   │   ├── BasePage.ts          # Base page class with reusable methods
│   │   ├── BrowserManager.ts    # Singleton browser management
│   │   └── TestDataFactory.ts   # Factory pattern for test data
│   ├── pages/
│   │   ├── LoginPage.ts         # Login page object
│   │   ├── DashboardPage.ts     # Dashboard page object
│   │   └── components/
│   │       └── Header.ts        # Reusable header component
│   └── utils/
│       ├── Logger.ts            # Winston logger
│       ├── ConfigReader.ts      # Configuration management
│       ├── ApiHelper.ts         # API testing utilities
│       └── ScreenshotHelper.ts  # Screenshot utilities
├── tests/
│   ├── ui/
│   │   └── login.spec.ts        # UI test examples
│   ├── api/
│   │   └── users.spec.ts        # API test examples
│   ├── visual/
│   │   └── homepage.spec.ts     # Visual regression tests
│   └── fixtures/
│       └── testFixtures.ts      # Custom test fixtures
├── testdata/
│   └── users.json               # Test data
├── config/
│   ├── dev.config.ts            # Development config
│   └── qa.config.ts             # QA config
├── .github/
│   └── workflows/
│       └── playwright.yml       # CI/CD pipeline
├── playwright.config.ts         # Playwright configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies and scripts
└── .env.example                 # Environment variables template

```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Playwright
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npm run install:browsers
   ```

4. **Set up environment variables**
   ```bash
   copy .env.example .env
   # Edit .env with your configuration
   ```

## 🧪 Running Tests

### Run all tests
```bash
npm test
```

### Run specific test suites
```bash
npm run test:ui          # All UI tests (Amazon tests)
```

### Run specific Amazon test files
```bash
npx playwright test tests/ui/amazon-search.spec.ts      # Search tests
npx playwright test tests/ui/amazon-product.spec.ts     # Product tests
npx playwright test tests/ui/amazon-cart.spec.ts        # Cart tests
npx playwright test tests/ui/amazon-navigation.spec.ts  # Navigation tests
```

### Run tests in specific browser
```bash
npm run test:chrome      # Chromium (default)
```

### Run tests in headed mode
```bash
npm run test:headed
```

### Debug tests
```bash
npm run test:debug
```

## 📊 Reports

### View HTML report
```bash
npm run report
```

### Generate Allure report
```bash
npm run report:allure
```

## 🎨 Design Patterns Used

### 1. **Page Object Model (POM)**
Encapsulates page elements and actions in dedicated classes.

### 2. **Singleton Pattern**
Used in `BrowserManager` and utility classes to ensure single instance.

### 3. **Factory Pattern**
`TestDataFactory` generates test data objects.

### 4. **Fluent Interface**
Method chaining for readable test code.

### 5. **Template Method Pattern**
`BasePage` provides template methods for common operations.

### 6. **Component Pattern**
Reusable components like `Header` can be composed into pages.

### 7. **Fixture Pattern**
Custom Playwright fixtures for setup/teardown automation.

## 🔧 Configuration

### Environment Variables
Configure in `.env` file:
- `BASE_URL` - Application base URL
- `API_BASE_URL` - API base URL
- `TEST_USER_EMAIL` - Test user email
- `TEST_USER_PASSWORD` - Test user password
- `HEADLESS` - Run in headless mode
- `LOG_LEVEL` - Logging level

### Playwright Config
Modify `playwright.config.ts` for:
- Browser settings
- Timeouts
- Reporters
- Parallel execution
- Screenshots/videos

## 📝 Writing Tests

### Example UI Test
```typescript
import { test, expect } from '../fixtures/testFixtures';

test('should login successfully', async ({ loginPage, page }) => {
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password');
  await expect(page).toHaveURL(/dashboard/);
});
```

### Example API Test
```typescript
import { ApiHelper } from '@utils/ApiHelper';

test('should get users', async () => {
  const api = new ApiHelper('https://api.example.com');
  const response = await api.get('/users');
  await api.verifyStatus(response, 200);
});
```

## 🐳 Docker

### Build Docker image
```bash
docker build -t playwright-tests .
```

### Run tests in Docker
```bash
docker run -it playwright-tests
```

## 🔄 CI/CD

GitHub Actions workflow automatically:
- Runs tests on push/PR
- Tests across multiple browsers
- Generates and uploads reports
- Runs daily scheduled tests

## 📚 Best Practices

1. **Use Page Objects** - Keep tests clean and maintainable
2. **Avoid Hard Waits** - Use smart waits from BasePage
3. **Use Test Data Factory** - Generate realistic test data
4. **Leverage Fixtures** - Automate setup/teardown
5. **Log Important Actions** - Use Logger for debugging
6. **Handle Errors Gracefully** - Capture screenshots on failure
7. **Keep Tests Independent** - Each test should run standalone
8. **Use Descriptive Names** - Clear test and method names

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

ISC

## 📞 Support

For questions or issues, please open a GitHub issue.

---

**Built with ❤️ using Playwright and TypeScript**
