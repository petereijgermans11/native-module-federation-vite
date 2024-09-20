import { initFederation } from '@softarc/native-federation';
import localManifest from './assets/manifest.local.json';
import testManifest from './assets/manifest.test.json';
import prodManifest from './assets/manifest.prod.json';

let manifestEnv: Manifest;
switch (window.location.hostname) {
	case 'https://prod.nl':
		manifestEnv = prodManifest;
		break;
	case 'https://test.nl':
		manifestEnv = testManifest;
		break;
	default:
		manifestEnv = localManifest;
		break;
}

(async () => {
	await initFederation(manifestEnv);
	await import('./bootstrap');
})();



type Manifest = {
	remote: string;
	remote4: string;
  }
