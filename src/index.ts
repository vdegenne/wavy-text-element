import {css, html, LitElement} from 'lit'
import {customElement, property} from 'lit/decorators.js'

@customElement('wavy-text')
export class WavyText extends LitElement {
	@property() label = ''

	static styles = css`
		span {
			display: inline-block;
			animation: wave 1.5s infinite ease-in-out;
		}
		@keyframes wave {
			0%,
			100% {
				transform: translateY(0);
			}
			50% {
				transform: translateY(-10px);
			}
		}
	`

	render() {
		return this.label
			.split('')
			.map(
				(letter, i) =>
					html`<span style="animation-delay:${i * 0.06}s"
						>${letter === ' ' ? html`&nbsp;` : letter}</span
					>`,
			)
	}
}
