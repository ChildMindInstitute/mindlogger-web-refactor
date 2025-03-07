# Child Mind Institute - MindLogger Web App

This repository is used for the respondent web app of the [MindLogger](https://mindlogger.org/) application stack.

## Application Stack

* MindLogger Admin - [GitHub Repo](https://github.com/ChildMindInstitute/mindlogger-admin)
* MindLogger Backend - [GitHub Repo](https://github.com/ChildMindInstitute/mindlogger-backend-refactor)
* MindLogger Mobile App - [GitHub Repo](https://github.com/ChildMindInstitute/mindlogger-app-refactor)
* MindLogger Web App - **This Repo**

## Getting Started

Running the app:

### 1. Prerequisites

- NodeJS `20.11.0` or higher, recommend using `asdf` or `nvm` to manage local node version
- Yarn 1.x
- [Backend](https://github.com/ChildMindInstitute/mindlogger-backend-refactor) project running locally or accessible in a test environment
  - If running locally, ensure that `http://localhost:5173` has been added to the BE's `CORS__ALLOW_ORIGINS` environment variable
- Configured [environment variables](#environment-variables):\
  `cp .env.example .env`

### 2. Run the app

- Install dependencies using `yarn`
- Run the project using `yarn dev` (see [scripts](#available-scripts))
- Open [http://localhost:5173](http://localhost:5173) in a browser to view the web app

## Features

See MindLogger's [Knowledge Base article](https://mindlogger.atlassian.net/servicedesk/customer/portal/3/topic/4d9a9ad4-c663-443b-b7fc-be9faf5d9383/article/337444910) to discover the MindLogger application stack's features.

## Technologies

- [Typescript](https://www.typescriptlang.org/) - TypeScript is JavaScript with syntax for types
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Vite](https://vitejs.dev/) - Next-generation frontend bundling tool
- [Redux Toolkit](https://redux-toolkit.js.org/) - Global state manager for JavaScript applications
- [Material UI](https://mui.com/) - Library of React UI components
- [React-query](https://tanstack.com/query/v4/?from=reactQueryV3&original=https://react-query-v3.tanstack.com/) - Powerful asynchronous state management
- [Feature-Sliced Design](https://feature-sliced.design/) - Architectural methodology

## Available Scripts

In the project directory, you can run:

### Running the app

- `yarn dev`

    Runs the app in the development mode.\
    Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

    The page will reload if you make edits.\
    You will also see any lint errors in the console.

- `yarn build`

    Builds the app for production to the `dist` folder.\
    It correctly bundles React in production mode and optimizes the build for the best performance.

    Your app is ready to be deployed!

    See the section [Building for Production](https://vitejs.dev/guide/build.html) for more information.

- `yarn preview`

    Once you've built the app, use this command to test it locally.\
    It will boot up a local static web server that serves the files from `dist` at [http://localhost:4173](http://localhost:4173).

### Testing

See the documentation on [Vitest](https://vitest.dev/guide/) for more information about running tests.

- `yarn test:watch` - Launches the test runner in the interactive watch mode.
- `yarn test` - Runs test suite once
- `yarn test:ui` - Run the Vitest UI at [http://localhost:51204/__vitest\__/](http://localhost:51204/__vitest__/)
- `yarn coverage` - Generate test coverage report

### Linting

- `yarn lint:check` - Check that source code follows eslint rules
- `yarn lint:fix` - Automatically fix problems detected by eslint
- `yarn prettier:check` - Check that source code follows prettier rules
- `yarn prettier:fix` - Automatically fix problems detected by prettier

## Environment Variables

| Key | Required | Default value            | Description |
| - | - |--------------------------| - |
| `NODE_ENV` | yes | `development`            | Node environment (`development` or `production`) |
| `VITE_ENV` | yes | `dev`                    | Server environment (`dev`, `stage`, or `prod`) |
| `VITE_API_HOST` | yes | `http://localhost:8000/` | MindLogger Backend API base URL |
| `VITE_ADMIN_PANEL_HOST` | no | `http://localhost:3000/` | MindLogger Admin URL |
| `VITE_SECURE_LOCAL_STORAGE_HASH_KEY` | yes | `ML_SECURE`              | Secure local storage hash key |
| `VITE_SECURE_LOCAL_STORAGE_PREFIX` | yes | `ML_SECURE`              | Secure local storage prefix |
| `VITE_IV_LENGTH` | yes | `16`                     | Encryption initialization vector length |
| `VITE_BUILD_VERSION` | yes | `dev-build`              | Build version |
| `VITE_MIXPANEL_TOKEN` | yes | null                     | Mixpanel client ID, refer to Confluence for correct environment key |
| `VITE_LAUNCHDARKLY_CLIENT_ID` | yes | null                     | LaunchDarkly client ID, refer to Confluence for correct environment key |
| `VITE_DD_APP_ID`              | no       | ""                       | DataDog RUM App ID                                  |
| `VITE_DD_CLIENT_TOKEN`        | no       | ""                       | DataDog RUM Client token                            |                                          
| `VITE_DD_VERSION`             | no       | local                    | Current admin panel version                         |
| `VITE_DD_TRACING_URLS`        | no       | ""                       | Comma separated URL prefixes that Datadog is allowed to trace. |  

## License

Common Public Attribution License Version 1.0 (CPAL-1.0)

Refer to [LICENSE.md](./LICENSE.md)
