import {css, html, LitElement, PropertyValues} from 'lit'
import {customElement, property, query} from 'lit/decorators.js'

@customElement('wavy-text')
export class WavyText extends LitElement {
	@property() label = ''
	/** in s */
	@property({type: Number}) speed = 1.5
	/** in px */
	@property({type: Number}) height = 10
	/**
	 * Delay between each letter in ms
	 */
	@property({type: Number}) delay = 60

	@query('span') spanElement!: HTMLElement

	#letters: string[] = []

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
	`

	render() {
		return this.#letters.map(
			(l, i) =>
				html`<span style="animation-delay:${i * this.delay}ms"
					>${l === ' ' ? html`&nbsp;` : l}</span
				>`,
		)
	}

	update(changed: PropertyValues<this>) {
		if (changed.has('label')) {
			const graph = new Intl.Segmenter('us', {
				granularity: 'grapheme',
			})
			const segs = graph.segment(this.label)
			this.#letters = Array.from(segs).map((s) => s.segment)
		}
		if (changed.has('speed')) {
			this.style.setProperty('--wavy-text-speed', this.speed + 's')
		}
		if (changed.has('height')) {
			this.style.setProperty('--wavy-text-height', this.height + 'px')
		}
		super.update(changed)
	}
}
