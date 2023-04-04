const defaultConfig = require("@wordpress/scripts/config/webpack.config.js")

module.exports = {
	...defaultConfig,
	...{
		externals:{
			...defaultConfig.externals,
			'react': 'React',
			'react-dom': 'ReactDom'
		}
	}
}
