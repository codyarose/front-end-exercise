import corsProxy from 'cors-anywhere'

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 8080

corsProxy
	.createServer({
		originWhiteList: [],
		requireHeader: ['origin', 'x-requested-with'],
	})
	.listen(port, host, function () {
		console.log(`Running CORS Anywhere on ${host}: ${port}`)
	})
