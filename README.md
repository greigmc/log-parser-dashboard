# Log Parser Dashboard

## Overview

**Log Parser Dashboard** is a React-based web application designed to parse, analyze, and visualize log files. It helps users extract key insights from log data such as IP addresses, counts, and other statistics, providing a clean, interactive dashboard to monitor system or network logs.

## Features

- **Log Parsing**  
  Reads raw log files and extracts relevant information like IP addresses, visited URLs, and status codes.

- **Statistics Display**  
  Summarized metrics such as unique IP addresses, top visited URLs, and most active IPs displayed via reusable `StatCard` components.

- **Interactive UI**  
  Built with React and styled using Material UI for a responsive, modern design.

- **Unit Tested**  
  Key components and logic are covered by automated tests using Vitest and React Testing Library.

- **(Planned) User Authentication**  
  Future support for secure login/signup to personalize and protect access to user dashboards.

## Getting Started

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/greigmc/log-parser-dashboard.git
   cd log-parser-dashboard
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

## Running the Application

```bash
npm run dev
```

## Test the Application with Vitest

```bash
npm run test
```

## Continuous Integration

This project uses GitHub Actions for Continuous Integration (CI). On every push or pull request to the `main` branch, the following checks are run:

- ✅ Prettier formatting check
- ✅ ESLint code linting
- ✅ Build verification
- ✅ Security audit (`npm audit`)
- ✅ Automated unit tests using Vitest
