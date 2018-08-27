# License API

## Description

License API based on NestJS

## ToDo

* The Email messages are all in German!
* Swagger has to be extended because there are missing some API documentations
* The tests have to be fixed
* An url license cannot be removed

## Installation

Step 1: Install the npm packages

```bash
$ npm install
```

Step 2: Create a constants.ts in server/src/ with the following values

```typescript
export const platformEnvironment = {
    platform: {
        name: 'Your License Site',
        admin: 'Your Name',
        url: 'https://yourwebite.com/'
    },
    version: '1.0.0',
    defaultEmail: 'your@email.com',
    mailerConfig: {
        // See nodemailer config
    }
};
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

