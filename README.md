# MyMCIT Project


## Running the app

- pull the repository
- run `npm install`
- create a .env file and add the following variables for your firebase project. These can be found under your application configuration in the firebase console.
```
VITE_FIREBASE_API_KEY=
VITE_AUTH_DOMAIN=
VITE_DATABASE_URL=
VITE_PROJECT_ID=
VITE_STORAGE_BUCKET=
VITE_MESSAGE_SENDER_ID=
VITE_AP_ID=
VITE_MEASUREMENT_ID=
```

### Running the app with real firebase project
- this project is preconfigured to connect to the firebase project passed in the environment variables
- run `npm run start`


### Running the app with firebase emulator
 [Emulator Docs](https://firebase.google.com/docs/emulator-suite)
- this project is configured to run with the emulators real time database
- after installing the dependencies
- install firebase cli `npm i firebase-tools -g`
- login to your account `firebase login`
- start the emulator `./run-firebase-emulator.sh`
  - can view the emulator console at `http://127.0.0.1:4000/ `
  - the real time database emulator will start with no data and may have to be seeded.
  - once this is seeded 1 time it should save to the firebase-emulator directory
- run `npm run dev` to start in development mode
- the development mode does not support google auth and is not required for a user to be authenticated due to the database rules.


======================================================================================================

## Configuration 
- React 
- Vite 
- TS
- Eslint
- React Testing Library & Vitest with Code Coverage
- Material UI
- Environment Variables
- Optional Git Hook
- Build Script
- Custom package.json scripts
- Examples of various react concepts
  - React state
  - React context
  - React router
  - Http with axios
  - Static Typing
  - Local Storage Manipulation
  - Responsive Design 





## Working with ENVs in React with Vite

- [vite env docs](https://vitejs.dev/guide/env-and-mode.html)

1. create a `.env` file in the root directory
2. Add the following line
3. Never expose or `git push` your API key!

```
VITE_CIVICS_API_KEY=[Your API key goes here]
```

- env must be prepended with VITE, or it will not be picked up.

4. Use it in the application


## Features ##
- Responsive/Advanced design
- React router with different pages
- Api querying, data mapping and error handling
- React state/context handling to share data with different components
- Chart integration
- Complete linter, hosting, build scripts and testing libraries with typescript
- Git repo using user stories/issue and trunk based development
