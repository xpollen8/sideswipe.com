import HTDB from 'HTDBjs';

let htdb;

const fetchSwipe = async (id) => {
	let intId = parseInt(id);
	if (!htdb) {
		htdb = new HTDB(0);
		//await htdb.load();
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
	return { body: await htdb.render() }
}

const handler = async (req, res) => {
	const { id } = req.query || 0;
	res.send(await fetchSwipe(id));
}

export default handler;
