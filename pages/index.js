import Head from 'next/head'

import HTDB from 'HTDBjs';

let htdb;

export async function getServerSideProps({ query: { path = [], id = 0 } = {} }) {
	const intId = parseInt(id);
	if (!htdb) {
		htdb = new HTDB(0);
	}

	htdb.prerender = () => {
		// override htdb file values
		const pageMax = Object.keys(htdb.defines).filter(f => {
			const [ page, num ] = f.split('page');
			return num === '0' || parseInt(num);
		}).length;
		if (intId < 1 || intId >= pageMax) { intId = pageMax; }
		htdb.define({ name: 'pageMax', body: `${pageMax}` });
		htdb.define({ name: 'nextUp', body: `/?id=${(intId < 1) ? pageMax : intId - 1}` });
		htdb.define({ name: 'thisNum', body: `${intId - 1}` });
	}
	console.log("SERVING", intId);
	return {
		props: { body: await htdb.render() }
	}
}

const Swipe = ({ body }) => (
	<div className="container">
		<Head>
			<title>Sideswipe</title>
			<link rel="icon" href="/favicon.ico" />
		</Head>
		<>
			{ <div dangerouslySetInnerHTML={{ __html: body }} /> }
		</>
	</div>
)

export default Swipe;
