import Head from 'next/head'

export async function getServerSideProps({ query = {} }) {
	const id = query.id || 0;
	const { results, errors } = await (require('../lib/fetch_data'))(`/api/swipe/${id}`);
	return {
		props: { id, ...results }
	}
}

const Swipe = ({ id, body }) => (
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
