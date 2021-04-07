export default {
	// Target: https://go.nuxtjs.dev/config-target
	mode: 'universal',

	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		title: 'bars_organizer',
		htmlAttrs: {
			lang: 'en'
		},
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: '' }
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
			{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Icons' }
		]
	},
	// Global CSS: https://go.nuxtjs.dev/config-css
	css: [
		'~/assets/main.scss',
	],

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
	],

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		// https://go.nuxtjs.dev/typescript
		'@nuxt/typescript-build'
	],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
		// https://go.nuxtjs.dev/bootstrap
		'nuxt-material-design-icons',
		'bootstrap-vue/nuxt',
		[
			'@nuxtjs/firebase',
			{
				config: {
					apiKey: "AIzaSyALrwfzc7-f8W32ub4R9IJSjAq1i-iBWso",
					authDomain: "levasi-a69ed.firebaseapp.com",
					projectId: "levasi-a69ed",
					storageBucket: "levasi-a69ed.appspot.com",
					messagingSenderId: "297913369431",
					appId: "1:297913369431:web:d2d7882499c8178b633412",
					measurementId: "G-BLQNLF9909"
				},
				services: {
					auth: true,
					firestore: true,
					functions: true,
					storage: true,
					database: true,
					messaging: true,
					performance: true,
					analytics: true,
					remoteConfig: true
				}
			}
		]
	],
	firebase: {
		// options
	},
	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {
	}
}
