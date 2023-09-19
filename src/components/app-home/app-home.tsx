import { Component, Host, Element, Prop, State, Fragment, h } from '@stencil/core'

type ResizeDirection = 'left' | 'right' | 'top' | 'bottom'

@Component({
	tag: 'app-home',
	styleUrl: 'app-home.css',
	shadow: true,
})
export class AppHome {
	@Element() element: HTMLAppHomeElement
	@Prop() resizeHorizontal: boolean = true
	@Prop() resizeVertical: boolean = true
	@State() resizing: boolean = false
	@State() dragging: boolean = false

	private mousePositionX: number
	private mousePositionY: number
	private elementPositionX: number
	private elementPositionY: number
	private elementWidth: number
	private elementHeight: number
	private resizeDirections: ResizeDirection[] = []
	private elementMinWidth: number = 400
	private elementMinHeight: number = 400

	private handleResizeDown = (event: MouseEvent, directions: ResizeDirection[] = []): void => {
		const elementClientRect = this.element.getBoundingClientRect()

		this.resizing = true
		this.resizeDirections = directions
		this.mousePositionX = event.clientX
		this.mousePositionY = event.clientY
		this.elementPositionX = elementClientRect.x
		this.elementPositionY = elementClientRect.y
		this.elementWidth = elementClientRect.width
		this.elementHeight = elementClientRect.height

		document.addEventListener('mousemove', this.handleResizeMove)
		document.addEventListener('mouseup', this.handleResizeUp)
	}

	private handleResizeMove = (event: MouseEvent): void => {
		if (this.resizeDirections.includes('right') || this.resizeDirections.includes('left')) {
			const deltaX: number = event.clientX - this.mousePositionX
			const elementWidth: number = this.resizeDirections.includes('right')
				? this.elementWidth + deltaX
				: this.resizeDirections.includes('left')
				? this.elementWidth + deltaX * -1
				: 0
			const elementPositionX: number = this.resizeDirections.includes('right')
				? this.elementPositionX
				: this.resizeDirections.includes('left')
				? this.elementPositionX + deltaX
				: 0

			if (elementWidth >= this.elementMinWidth) {
				this.element.style.setProperty('--app-home-width', `${elementWidth}px`)
				this.element.style.setProperty('--app-home-left', `${elementPositionX}px`)
			}
		}

		if (this.resizeDirections.includes('bottom') || this.resizeDirections.includes('top')) {
			const deltaY: number = event.clientY - this.mousePositionY
			const elementHeight: number = this.resizeDirections.includes('bottom')
				? this.elementHeight + deltaY
				: this.resizeDirections.includes('top')
				? this.elementHeight + deltaY * -1
				: 0
			const elementPositionY: number = this.resizeDirections.includes('bottom')
				? this.elementPositionY
				: this.resizeDirections.includes('top')
				? this.elementPositionY + deltaY
				: 0

			if (elementHeight >= this.elementMinHeight) {
				this.element.style.setProperty('--app-home-height', `${elementHeight}px`)
				this.element.style.setProperty('--app-home-top', `${elementPositionY}px`)
			}
		}
	}

	private handleResizeUp = (): void => {
		this.resizing = false
		document.removeEventListener('mousemove', this.handleResizeMove)
		document.removeEventListener('mouseup', this.handleResizeUp)
	}

	private handleDragDown = (event: MouseEvent): void => {
		const elementClientRect = this.element.getBoundingClientRect()

		this.dragging = true
		this.mousePositionX = event.clientX
		this.mousePositionY = event.clientY
		this.elementPositionX = elementClientRect.x
		this.elementPositionY = elementClientRect.y

		document.addEventListener('mousemove', this.handleDragMove)
		document.addEventListener('mouseup', this.handleDragUp)
	}

	private handleDragMove = (event: MouseEvent): void => {
		const deltaX: number = event.clientX - this.mousePositionX
		const deltaY: number = event.clientY - this.mousePositionY

		const elementLeft: number = this.elementPositionX + deltaX
		const elementTop: number = this.elementPositionY + deltaY

		this.element.style.setProperty('--app-home-top', `${elementTop}px`)
		this.element.style.setProperty('--app-home-left', `${elementLeft}px`)
	}

	private handleDragUp = (): void => {
		this.dragging = false
		document.removeEventListener('mousemove', this.handleDragMove)
		document.removeEventListener('mouseup', this.handleDragUp)
	}

	private handleMaximize = (event: MouseEvent): void => {
		event.stopPropagation
		event.preventDefault
		this.element.style.setProperty('--app-home-left', '32px')
		this.element.style.setProperty('--app-home-top', '32px')
		this.element.style.setProperty('--app-home-width', 'calc(100% - 64px)')
		this.element.style.setProperty('--app-home-height', 'calc(100% - 64px)')
	}

	render() {
		return (
			<Host class={{ resizing: this.resizing, dragging: this.dragging }}>
				<div id="controls">
					<div class="control" id="close" />
					<div class="control" id="minimize" />
					<div class="control" id="maximize" onClick={(event) => this.handleMaximize(event)} />
				</div>
				<div id="title-bar" onMouseDown={(event) => this.handleDragDown(event)} onDblClick={(event) => this.handleMaximize(event)}>
					<div></div>
					<div></div>
					<div></div>
				</div>
				<div>
					<a href="/albums">Albums</a>
					<a href="/artists">Artists</a>
				</div>
				<div id="content">
					<slot />
				</div>
				{this.resizeHorizontal ? (
					<>
						<div
							id="resize-left"
							class="resize-horizontal"
							onMouseDown={(event) => this.handleResizeDown(event, ['left'])}
						/>
						<div
							id="resize-right"
							class="resize-horizontal"
							onMouseDown={(event) => this.handleResizeDown(event, ['right'])}
						/>
					</>
				) : null}
				{this.resizeVertical ? (
					<>
						<div
							id="resize-top"
							class="resize-vertical"
							onMouseDown={(event) => this.handleResizeDown(event, ['top'])}
						/>
						<div
							id="resize-bottom"
							class="resize-vertical"
							onMouseDown={(event) => this.handleResizeDown(event, ['bottom'])}
						/>
					</>
				) : null}
				{this.resizeHorizontal && this.resizeVertical ? (
					<>
						<div
							id="resize-left-top"
							class="resize-both"
							onMouseDown={(event) => this.handleResizeDown(event, ['left', 'top'])}
						/>
						<div
							id="resize-right-top"
							class="resize-both"
							onMouseDown={(event) => this.handleResizeDown(event, ['right', 'top'])}
						/>
						<div
							id="resize-left-bottom"
							class="resize-both"
							onMouseDown={(event) => this.handleResizeDown(event, ['left', 'bottom'])}
						/>
						<div
							id="resize-right-bottom"
							class="resize-both"
							onMouseDown={(event) => this.handleResizeDown(event, ['right', 'bottom'])}
						/>
					</>
				) : null}
			</Host>
		)
	}
}
