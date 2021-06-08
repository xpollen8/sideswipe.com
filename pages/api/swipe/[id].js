import HTDB from 'HTDBjs';

let htdb;

const defs = `
#include	buh
#
#	hello!
# 
#live if (blah)
#live	endif

#define	index.html hello world
#live if (blah)
	hello blah
#live	endif
`;

const fetchSwipe = async (id) => {
	let intId = parseInt(id);
	if (!htdb) {
		htdb = new HTDB('site.htdb', 0);
		await htdb.load();
	}
	// override htdb file values
	const pageMax = Object.keys(htdb.defines).filter(f => {
		const [ page, num ] = f.split('page');
		return num === '0' || parseInt(num);
	}).length;
	if (intId < 1 || intId >= pageMax) { intId = pageMax; }
	htdb.define({ name: 'pageMax', body: `${pageMax}` });
	console.log("pageMax", pageMax, htdb.getval('pageMax'));
	htdb.define({ name: 'nextUp', body: `/?id=${(intId < 1) ? pageMax : intId - 1}` });
	htdb.define({ name: 'thisNum', body: `${intId - 1}` });
	return { body: await htdb.render() }
}

const handler = async (req, res) => {
	const { id } = req.query || 0;
	res.send(await fetchSwipe(id));
}

export default handler;
