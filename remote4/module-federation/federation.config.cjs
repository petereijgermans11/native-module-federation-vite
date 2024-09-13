const { withNativeFederation, shareAll } = require('@softarc/native-federation/build');

module.exports = withNativeFederation({
	name: 'remote4',
	exposes: {
		'./remote-app4': './src/App.tsx',
	},
	shared: shareAll(),
	skip: ['react-dom/server', 'react-dom/server.node', 'vite-react-microfrontends'],
});
