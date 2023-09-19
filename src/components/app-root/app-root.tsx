import { Component, Host, h } from '@stencil/core'
import { Router } from '@vaadin/router'

@Component({
	tag: 'app-root',
	styleUrl: 'app-root.css',
	shadow: true,
})
export class AppRoot {
	private routerOutlet!: HTMLDivElement

	componentDidLoad() {
		const router = new Router(this.routerOutlet)

		router.setRoutes([
			{
				path: '/',
				component: 'app-home',
				children: [
					{ path: '/albums', component: 'app-albums' },
					{ path: '/artists', component: 'app-artists' },
				],
			},
			{ path: '/login', component: 'app-login' },
		])
	}

	render() {
		return (
			<Host>
				<div ref={(element) => (this.routerOutlet = element)}></div>
			</Host>
		)
	}
}
