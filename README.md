# React host and remote

## Getting started

From this root directory execute:

- npm run install:deps
- npm run preview:remote
- npm run preview:remote4 (in a different terminal)
- npm run preview:host (in a different terminal)

Open your browser at http://localhost:4173/ to see the amazing result

![screenshot](docs/screenshot.png)


## Adding a new Remote Module

1. npm create vite@latest     //-->  !!! Choose React and TypeScript !!!
2. cd remote4
3. npm i @module-federation/vite  -save-dev
4. npm i @softarc/native-federation -save-dev
5. npm i @softarc/native-federation-esbuild -save-dev
6. Change the contents of src/main.tsx for bootstrapping the app:

~~~
import { initFederation } from '@softarc/native-federation';

(async () => {
  await initFederation();
  await import('./bootstrap');
})();
~~~


7. Create src/bootstrap.tsx
~~~
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

8. Config Module Federation. Define a new federation.config.js in a folder: module-federation in the Remote Module:
~~~
const { withNativeFederation, shareAll } = require('@softarc/native-federation/build');

module.exports = withNativeFederation({
	name: 'remote4',
	exposes: {
		'./remote-app4': './src/App.tsx',
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



## Change Host manifest files

Add your new Remote app to the 'assets/manifest-files' in your Host - app.
For example adapt the assets/manifest.local.json

~~~

{
    "remote": "http://localhost:4174/remoteEntry.json",
    "remote4": "http://localhost:4175/remoteEntry.json"
}

~~~

10. load your new RemoteModule in the App.tsx

~~~
export default () => {
	const Remote = React.lazy(
		async () => await loadRemoteModule('remote4', './remote-app4')
	);

~~~

11. Adapt the package.json in the root of the project for building en preview the new Microfrontend App. 
Add the added Remote module in the build and preview step!

~~~
"scripts": {
		"install:deps": "npm --prefix ./host install && npm --prefix ./remote install && npm --prefix ./remote4 install",
		"postinstall:deps": "npm --prefix ./host run build && npm --prefix ./remote run build && npm --prefix ./remote4 run build",
		"serve:host": "npm --prefix ./host run dev",
		"serve:remote": "npm --prefix ./remote run dev",
		"serve:remote4": "npm --prefix ./remote4 run dev",
		"build:host": "npm --prefix ./host run build",
		"build:remote": "npm --prefix ./remote run build",
		"build:remote4": "npm --prefix ./remote4 run build",
		"preview:host": "npm --prefix ./host run preview",
		"preview:remote": "npm --prefix ./remote run preview",
		"preview:remote4": "npm --prefix ./remote4 run preview"
	},
~~~


