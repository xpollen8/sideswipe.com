import Head from 'next/head'
import path from "path";
import getConfig from 'next/config'
import HTDB from 'HTDBjs';
const { serverRuntimeConfig } = getConfig()

let htdb;

export async function getServerSideProps({ query: { path = [], id = 0 } = {} }) {
	console.log("IN SERVER", { path, id });
	let intId = parseInt(id);
	if (!htdb) {
		if (process.env.NODE_ENV === "production") {
			htdb = new HTDB(path.join(process.cwd(), ".next/server/chunks"), 1);
		} else {
			htdb = new HTDB(serverRuntimeConfig.PROJECT_ROOT, 1);
		}
	}

	htdb.prerender = () => {
		// override htdb file values - this can go away when '#live' works..
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
		props: { body: await htdb.render('index.html') }
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
