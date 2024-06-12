# Monet Points

## Table of Contents

- [Project Overview](#project-overview)
- [Getting Started](#getting-started)
- [Writing Commits](#writing-commits)
- [Running the App](#running-the-app)
- [Writing Clean and Elegant Code](#writing-clean-and-elegant-code)
- [Design System](#design-system)
- [Libraries Used](#libraries-used)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

Monet Points is a Next.js frontend application designed to provide an elegant and efficient user experience. This document provides guidelines and instructions for developers to contribute effectively to the project.

## Getting Started

### Prerequisites

Ensure you have the following installed on your development machine:

- Node.js (>= 20.x)
- npm (>= 10.x) or yarn (>= 1.22.x)

### Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/monet-work/monet-web3
cd monet-points
npm install


# Writing Commits
We follow the Conventional Commits specification for our commit messages.

## Bad Commits
The following commits will be rejected:

git commit -m "fixed bug"
git commit -m "update files"

## Good Commits
Use the following format for commits:


### For adding new features
git commit -m "feat: add user authentication feature"

### For adding bug fix
git commit -m "fix: resolve login issue"

### For updating documentation
git commit -m "docs: update API documentation"

### For style related changes
git commit -m "style: format code with Prettier"

### For refactoring
git commit -m "refactor: optimize user authentication logic"

### For adding tests
git commit -m "test: add tests for user authentication"

# Running the App

## Development Server
To run the development server:

```bash
npm run dev
```

Open http://localhost:3000 with your browser to see the result. (The port might differ if you have a server running on port 3000)


## Build for Production
To create a production build:

```bash
npm run build
```

## To start the production server:

```bash
npm run start
```

## Linting
To lint the code:

```bash
npm run lint
```

## Writing Clean and Elegant Code

### Best Practices

Avoid Coupling: Ensure that your modules are loosely coupled. Use dependency injection and interface segregation principles to reduce dependencies between modules.
Single Responsibility Principle: Each module or function should have a single responsibility.
Code Reviews: All code changes should be reviewed by at least one other developer. Use pull requests to facilitate code reviews.


## Design System

We use the Shadcn UI Design System to ensure a consistent look and feel across the application. Follow the design guidelines and use the components provided by Shadcn UI.

### Usage Example

```tsx
import { Button } from '@components/ui/button';

export default function Example() {
  return <Button variant="primary">Click me</Button>;
}
```

## Libraries Used

### Core Libraries

Next.js: The React Framework for production
React: A JavaScript library for building user interfaces
Tailwind CSS: A utility-first CSS framework for rapid UI development
Radix UI: Primitives for building accessible, high-quality design systems and web apps
React Query: Data-fetching library for React
Zod: TypeScript-first schema declaration and validation library

### Suggested Usage

### React Query

```typescript
import { useQuery } from '@tanstack/react-query';

function fetchUser(id: string) {
  return fetch(`/api/user/${id}`).then((res) => res.json());
}

export function useUser(id: string) {
  return useQuery(['user', id], () => fetchUser(id));
}
```

### Tailwind CSS

```tsx
<div className="flex items-center justify-center h-screen">
  <h1 className="text-4xl font-bold">Hello, world!</h1>
</div>
```

## Contributing

Please follow the guidelines below to contribute to the project.

### Clone the Repository
Clone the repository on GitHub:

```bash
git clone https://github.com/monet-work/monet-web3
```

### Create a Feature Branch
Create a new branch for your feature or bug fix:

```bash
git checkout -b feature/your-feature-name
```

### Make Changes and Commit
Make your changes and commit them using a descriptive commit message:

```bash
git commit -m "feat: add new feature"
```

### Push to Your branch and Submit a Pull Request
Push your changes to your fork and submit a pull request to the **develop** repository:

```bash
git push origin feature/your-feature-name
```


