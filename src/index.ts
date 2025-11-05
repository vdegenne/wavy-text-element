import {css, html, LitElement, PropertyValues} from 'lit'
import {customElement, property, state} from 'lit/decorators.js'

@customElement('wavy-text')
export class WavyText extends LitElement {
	/** in s */
	@property({type: Number}) speed = 1.5
	/** in px */
	@property({type: Number}) height = 10
	/**
	 * Delay between each letter in ms
	 */
	@property({type: Number}) delay = 60

	@state() private letters: string[] = []

	#observer = new MutationObserver(this.#computerLetters.bind(this))

	connectedCallback(): void {
		super.connectedCallback()
		this.#observer.observe(this, {
			childList: true,
			subtree: true,
			characterData: true,
		})
		this.#computerLetters()
	}
	disconnectedCallback(): void {
		super.disconnectedCallback()
		this.#observer.disconnect()
	}

	render() {
		return html`<slot></slot>${this.letters.map(
				(l, i) =>
					html`<span style="animation-delay:${i * this.delay}ms"
						>${l === ' ' ? html`&nbsp;` : l}</span
					>`,
			)}`
	}

	async #computerLetters() {
		this.letters = []
		await this.updateComplete
		this.letters = Array.from(
			new Intl.Segmenter('us', {
				granularity: 'grapheme',
			}).segment(this.textContent),
		).map((s) => s.segment)
	}

	update(changed: PropertyValues<this>) {
		if (changed.has('speed')) {
			this.style.setProperty('--wavy-text-speed', this.speed + 's')
		}
		if (changed.has('height')) {
			this.style.setProperty('--wavy-text-height', '-' + this.height + 'px')
		}
		super.update(changed)
	}

	static styles = css`
		span {
			display: inline-block;
			animation: wave var(--wavy-text-speed) infinite ease-in-out;
		}
		@keyframes wave {
			0%,
			100% {
				transform: translateY(0);
			}
			50% {
				transform: translateY(var(--wavy-text-height));
			}
		}
		slot {
			display: none;
		}
	`
}
