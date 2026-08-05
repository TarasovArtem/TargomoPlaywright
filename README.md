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
