# React host and remote

## Getting started

From this directory execute:

- npm run install:deps
- npm run preview:remote
- npm run preview:host (in a different terminal)

Open your browser at http://localhost:4173/ to see the amazing result

![screenshot](docs/screenshot.png)


## Adding a new Remote

1. npm create vite@latest     //-->  !!! Choose React and TypeScript !!!
2. cd remote2
3. npm i @module-federation/vite  -save-dev
4. npm i @softarc/native-federation -save-dev
5. npm i @softarc/native-federation-esbuild -save-dev
6. Change the contents of src/main.tsx:

~~~
import { initFederation } from '@softarc/native-federation';

(async () => {
  await initFederation();
  await import('./bootstrap');
})();

~~~
7. Create src/bootstrap.tsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
~~~

8. Config Module Federation. Define a new federation.config.js:
~~~
const { withNativeFederation, shareAll } = require('@softarc/native-federation/build');

module.exports = withNativeFederation({
	name: 'remote2',
	exposes: {
		'./remote-app2': './src/App.tsx',
	},
	shared: shareAll(),
	skip: ['react-dom/server', 'react-dom/server.node', 'vite-react-microfrontends'],
});
~~~

9. Change vite.config.ts to use Native Module Federation:

~~~
import { federation } from '@module-federation/vite';
import { createEsBuildAdapter } from '@softarc/native-federation-esbuild';
import { reactReplacements } from '@softarc/native-federation-esbuild/src/lib/react-replacements';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(async ({ command }) => ({
  server: {
    fs: { allow: ['.', '../shared'] },
  },
  assetsInclude: ['**/*.svg'],
  plugins: [
    await federation({
      options: {
        workspaceRoot: __dirname,
        outputPath: 'dist',
        tsConfig: 'tsconfig.json',
        federationConfig: 'module-federation/federation.config.cjs',
        dev: command === 'serve',
      },
      adapter: createEsBuildAdapter({ 
        plugins: [],
        fileReplacements: reactReplacements.dev }),
    }),
    react(),
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
}));
~~~

10. Change the package.json in the root of the project for building en preview the App


11 change all contents of App.tsx


## Change Host

Add your new Remote aap to the main.tsx in your Host - app

~~~
import { initFederation } from '@softarc/native-federation';

(async () => {
	await initFederation({
		remote: 'http://localhost:4174/remoteEntry.json',
		remote4: 'http://localhost:4175/remoteEntry.json',
	});

	await import('./bootstrap');
})();
~~~

load your RemoteModule in tje App.tsx

~~~
export default () => {
	const Remote = React.lazy(
		async () => await loadRemoteModule('remote', './remote-app')
	);

~~~

Change your build-scripts in your package.json

