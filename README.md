# TargomoPlaywright

![Playwright E2E Tests](https://github.com/TarasovArtem/TargomoPlaywright/actions/workflows/playwright.yml/badge.svg?branch=main)

#### Description

Playwright E2E test suite for the [Targomo](https://poi.targomo.com) POI (points of interest) map application. This is the Playwright counterpart of [TarasovArtem/Targomo](https://github.com/TarasovArtem/Targomo) — same live app, same scenarios, same Page Object Model, ported from Cypress to Playwright + TypeScript.

##### Select group of POIs

    Select the Gastronomy group of POIs from the tree component,
    and its Restaurant / Fast food / Food court subcategories individually.

##### Category tree behavior

    Selecting only a subcategory leaves the parent checkbox indeterminate;
    collapsing a category removes its subcategories from the DOM;
    unrelated categories can be selected independently of each other.

##### POI data requests

    Selecting a category/subcategory triggers a real request to
    api.targomo.com/pointofinterest/**/*.mvt with the matching group id -
    verifying the app actually fetches the right data, not just a UI toggle.

See [TEST_CASES.md](TEST_CASES.md) for the full list of test cases covered by this suite, with preconditions, steps, and expected results for each.


### Commands for running tests and file structure

#### Installation

    git clone https://github.com/TarasovArtem/TargomoPlaywright.git

    cd TargomoPlaywright

    npm ci

    npx playwright install chromium firefox webkit


#### Interactive UI mode

    npm run test:e2e:ui


#### Run all tests in a specific browser from the terminal

    npm run test:e2e:chromium

    npm run test:e2e:firefox

    npm run test:e2e:webkit

or all three, sequentially:

    npm run test:e2e


#### View the last HTML report

    npm run report


#### Test files structure

    ./tests/select_group_poi.spec.ts
    ./tests/category_tree_behavior.spec.ts
    ./tests/poi_data_requests.spec.ts


#### Page Object files structure

    ./tests/pageObjects/categories.ts
    ./tests/pageObjects/map.ts
    ./tests/pageObjects/navigation.ts
    ./tests/pageObjects/subCategories.ts


### Continuous Integration

Playwright E2E tests are automatically executed with GitHub Actions ([.github/workflows/playwright.yml](.github/workflows/playwright.yml)).

Tests run on:

- pushes to `main`
- pull requests targeting `main`
- manual workflow execution (`workflow_dispatch`)

The pipeline:

1. Checks out the repository
2. Installs Node.js dependencies with `npm ci`
3. Installs the matrix browser's binary (`playwright install --with-deps`)
4. Runs the Playwright E2E suite against the live app (Chromium, Firefox, and WebKit, each as a separate CI job)
5. Uploads the HTML report (traces + screenshots on failure) as a workflow artifact


### Engineering notes

Three real, non-obvious issues surfaced while getting this suite green on actual GitHub Actions runners — not theoretical, all confirmed with evidence from real CI runs before being fixed:

**Playwright's default parallelism overloaded a live external site.** Unlike a project's own test server, `poi.targomo.com` isn't something this repo scales to handle concurrent hits from. Playwright's default 4 parallel workers produced real timeouts (6/10 passing); running sequentially fixed it outright (10/10). `playwright.config.ts` sets `fullyParallel: false` / `workers: 1` deliberately, with the reasoning left in a comment so it doesn't get "optimized" away later.

**An undismissed cookie-consent dialog was silently blocking the map.** Playwright gives every test a fresh browser context (unlike Cypress, which can carry cookies across `it()` blocks within one spec run), so the dialog genuinely reappeared on every single test here. Confirmed by downloading a failed run's accessibility-snapshot artifact from GitHub Actions and finding the dialog present, with `Restaurant` shown as `[checked]` right next to it — the click worked, the dialog just sat on top of the map. Fixed in `Navigation.navigate()`.

**Headless Firefox on Linux silently failed to render the map at all.** After the two fixes above, `poi_data_requests.spec.ts` still timed out on Firefox only, in CI only. Downloading the failure screenshot showed a completely blank map area. Adding temporary browser-console logging (pushed to CI, inspected via `gh run view --log`) surfaced the real error: `Failed to create WebGL context: WebGL creation failed`. This app's map is WebGL-rendered (MapLibre), and headless Firefox on Linux can't initialize a GL context at all — so it never requested a single tile. Firefox user-pref overrides (`webgl.force-enabled`, etc.) did not fix it: the failure screenshot was byte-for-byte identical before and after. The actual fix runs Firefox headed under a virtual display (`xvfb-run`) in CI only (`playwright.config.ts`'s `headless: !process.env.CI` + the workflow's `xvfb` step) — headless locally on Windows was never affected.
