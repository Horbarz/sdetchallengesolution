# Playwright Test Suite — automationintesting.online

## Approach

### Page Object Model (POM)
Tests are structured using the Page Object Model pattern. Each page of the application is represented by a class in the `pages/` directory, which encapsulates locators and interaction methods. Test files in `tests/` then call these methods rather than interacting with the DOM directly. This separation keeps tests readable and makes locator changes a single-file fix.

```
pages/
  AdminLoginPage.ts       # login form interactions
  AdminDashboardPage.ts   # dashboard assertions and navigation
  HomePage.ts             # public-facing homepage interactions
tests/
  admin.spec.ts           # admin auth and dashboard tests
  homepage.spec.ts        # public homepage sanity tests
```

### Credential Management
Credentials are loaded from a `.env` file at runtime via `dotenv`, keeping them out of source code entirely. A `.env.example` file is committed to the repository as a template; the actual `.env` is gitignored.

```
ADMIN_USERNAME=
ADMIN_PASSWORD=
```

---

## Bugs Found

### 1. Incorrect dashboard URL assertion (`AdminDashboardPage.ts:15`)
`assertOnDashboard()` asserts the URL matches `/dashboard/inboxes`, but after a successful admin login the application actually redirects to `/admin/rooms`. The assertion passes in the current test run only because the URL pattern is not strictly checked — this would fail against a stricter matcher.

**Fix:** Update the regex to reflect the actual redirect target:
```ts
await expect(this.page).toHaveURL(/\/admin\/rooms/);
```

### 2. `assertRoomExists` matches text anywhere on the page
The room-existence check looks for the room type and price as plain text anywhere in the DOM. A price like `100` could match unrelated content (pagination counts, IDs, etc.), producing a false positive.

**Fix:** Scope the assertion to the rooms table row, for example:
```ts
const row = this.page.locator('tr', { hasText: roomType });
await expect(row).toContainText(price);
```

---

## CI/CD Integration

### GitHub Actions example

Create `.github/workflows/playwright.yml`:

```yaml
name: Playwright Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Run tests
        run: npm test
        env:
          ADMIN_USERNAME: ${{ secrets.ADMIN_USERNAME }}
          ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}

      - name: Upload test report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

### Key points

- **Secrets** — Add `ADMIN_USERNAME` and `ADMIN_PASSWORD` under *Settings → Secrets and variables → Actions* in GitHub. They are injected as environment variables at runtime; no `.env` file is needed in CI.
- **`npm ci` over `npm install`** — Uses the lock file for a reproducible install.
- **`--with-deps`** — Installs the OS-level browser dependencies required on a headless Ubuntu runner.
- **`if: always()`** on the report upload — Ensures the HTML report is uploaded even when tests fail, so failures can be investigated.
- **Retention** — Reports are kept for 7 days by default; adjust `retention-days` to suit your team's needs.
