# License Client

## Description

Client as GUI for InnoLicense. This client only works if you install the server. The client is build with Angular 6 and Ionic 4!

## ToDo

* The tests have to be fixed and added

## Installation

Step 1: Install the npm packages

```bash
$ npm install
```

Step 2: Create a constants.ts in client/src/environments/ with the following values

```typescript
export const platformEnvironment = {
    platform: {
        name: 'Your License Site',
        admin: 'Your Name',
        url: 'https://yourwebite.com/'
    },
    api: {
        url: 'https://urltoapi.com/',
    }
};
```

Step 3: Create an vendor account

You can uncomment the registration part in src/views/auth/register/ and src/views/auth/login/ or you use Postman and register an account directly via Rest-API

## Running the app

```bash
# development
$ npm run start

# production mode
$ npm run build
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run e2e

```

