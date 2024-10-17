import { loadRemoteModule } from '@softarc/native-federation';
import React from 'react';
import { of, tap } from 'rxjs';
import './App.css';
import Counter from './components/Counter';
import rhino from './assets/rhino1.jpeg';

export default () => {
	const Remote = React.lazy(
		async () => await loadRemoteModule('remote', './remote-app')
	);
	
	const Remote4 = React.lazy(
		async () => await loadRemoteModule('remote4', './remote-app4')
	);

	React.useEffect(() => {
		of('emit')
			.pipe(tap(() => console.log("I'm RxJs from host")))
			.subscribe();
	}, []);

	return (
		<>
			<div className='host'>
				<div className='card'>
					<div className='icon'>
					<img src={rhino} />
					</div>
					<div className='title'>I'm the host app</div>
					<Counter />
					<div/>

					<React.Suspense fallback='loading...'>
				       <Remote />
			        </React.Suspense>

					

					<React.Suspense fallback='loading...'>
					<Remote4 />
			        </React.Suspense>
				</div>
			</div>

			
			
		</>
	);
};
