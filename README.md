# SDET Technical Challenge_Shady Meadows B&B

## Part 1 API Automation (Karate)
Git clone the repository
Navigate into the karate_project directory
From the project directory, run ./mvnw clean test 
Once the test is complete, an HTML test report is generated in this path: target/karate-reports/karate-summary.html. The report includes a summary of  passed/failed scenarios, step-level details, and request/response payloads for each test.
Open the report with any browser


## Part 2 UI Automation (Playwright)

### Page Object Model (POM)
The tests are structured using the Page Object Model pattern. Each page of the application is represented by a class in the `pages/` directory that contains the locators and web interactions. The Test files are in `tests/` then call the methods in the pages directory rather than interacting with the UI elements directly. 


### Credential Management
Login credentials are loaded from a `.env` file at runtime via `dotenv`, keeping them out of source code entirely. A `.env.example` file is committed to the repository as a template for anyone testing the code; the actual `.env` is gitignored.

```
ADMIN_USERNAME=
ADMIN_PASSWORD=
```

---

## Bugs Found

### 1. Incorrect dashboard URL assertion (`AdminDashboardPage.ts:15`)
`assertOnDashboard()` asserts the URL matches `/dashboard/inboxes` which is according to the documentation provided, but after a successful admin login the application actually redirects to `/admin/rooms`.


## CI/CD Integration

### GitHub Actions example

Create your github actions yml file `.github/workflows/cicd.yml` (Check the github actions file I created for the CI/CD pipeline)

Configure it to run either on push or on pull request
You can also add a scheduler so that it runs at certain intervals

### Important Point
Since the credentials are not exposed, it's a best practice to add credentials as secrets in github so that credentials are not exposed to a bad actor.

- **Secrets** — Add `ADMIN_USERNAME` and `ADMIN_PASSWORD` under *Settings → Secrets and variables → Actions* in GitHub. They are injected as environment variables at runtime; no `.env` file is needed in CI.

- **`npm ci` over `npm install`** — Uses the lock file for a reproducible install.
- **`--with-deps`** — Installs the OS-level browser dependencies required on a headless Ubuntu runner.
- **`if: always()`** on the report upload — Ensures the HTML report is uploaded even when tests fail, so failures can be investigated.

