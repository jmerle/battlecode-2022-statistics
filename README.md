# Battlecode 2022 Statistics

[![Build Status](https://github.com/jmerle/battlecode-2022-statistics/workflows/Build/badge.svg)](https://github.com/jmerle/battlecode-2022-statistics/actions/workflows/build.yml)
[![Scrape Status](https://github.com/jmerle/battlecode-2022-statistics/workflows/Scrape/badge.svg)](https://github.com/jmerle/battlecode-2022-statistics/actions/workflows/scrape.yml)

This repository contains a [website](https://jmerle.github.io/battlecode-2022-statistics/) that displays some Battlecode 2022 statistics.

The data is scraped from the Battlecode 2022 API. The data that is currently used on the website can be found in the [`data.json`](https://github.com/jmerle/battlecode-2022-statistics/blob/gh-pages/data.json) file on the [`gh-pages`](https://github.com/jmerle/battlecode-2022-statistics/tree/gh-pages) branch.

## Development

```bash
# Clone the repository
git clone https://github.com/jmerle/battlecode-2022-statistics.git

# cd into the cloned repository
cd battlecode-2022-statistics

# Install the dependencies
yarn

# Decide what you want to do next

# Build the code to the build/ directory
yarn build

# Serve a development version of the website and open it in the browser
yarn serve

# Scrape the latest data from the Battlecode 2022 API
yarn scrape --force

# Lint the code for possible mistakes
yarn lint

# Automatically fix linting mistakes where possible
yarn fix
```
