const path = require("path");
const { gitDescribeSync } = require("git-describe");
process.env.VUE_APP_GIT_HASH = gitDescribeSync().hash;
process.env.VUE_APP_GIT_TAG = gitDescribeSync().tag;
const version = require("./package.json").version;

function resolve(dir) {
	return path.join(__dirname, dir);
}
module.exports = {
	runtimeCompiler: true,
	publicPath: process.env.PUBLIC_PATH,
	transpileDependencies: [
		/ckeditor5-[^/\\]+[/\\]src[/\\].+\.js$/,
	],
	configureWebpack: {
		devtool: 'source-map',
		resolve: {
			fallback: {
				path: require.resolve('path-browserify'), // Se vuoi usare il polyfill
				// path: false  // Se vuoi disabilitare il polyfill per 'path'
				buffer: require.resolve('buffer')  // Polyfill per 'Buffer'
			},
		},
	},	
	chainWebpack: (config) => {
		config.resolve.alias.set("~theme", resolve(`src/theme/${process.env.VUE_APP_THEME}`));
		config.output.filename(`js/[name].[hash:8].${version}.js`).chunkFilename(`js/[name].[hash:8].${version}.js`);
		//.filename(`css/[name].[hash:8].${version}.css`)
		//.chunkFilename(`css/[name].[hash:8].${version}.css`);
		devtool: 'source-map';
	},
	css: {
		loaderOptions: {
			sass: {
				additionalData: `
                    $VUE_APP_BACKGROUND: ${process.env.VUE_APP_BACKGROUND};                    
                `,
			},
		},
	},
	// devServer Options don't belong into `configureWebpack`
	devServer: {
		host: "5t.drupalvm.test",
		hot: true,
		https: true,
		client: {
			overlay: {
			  runtimeErrors: (error) => {
				const ignoreErrors = [
				  "ResizeObserver loop limit exceeded",
				  "ResizeObserver loop completed with undelivered notifications.",
				];
				if (ignoreErrors.includes(error.message)) {
				  return false;
				}
				return true;
			  },
			},
		  },
	}
};
