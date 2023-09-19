import { Component, Host, h } from '@stencil/core'

@Component({
	tag: 'app-login',
	styleUrl: 'app-login.css',
	shadow: true,
})
export class AppLogin {
	render() {
		return (
			<Host>
				<div>Login...</div>
			</Host>
		)
	}
}
