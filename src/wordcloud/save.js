/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';
import WordCloud from "./Wordcloud"

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function Save({attributes}) {
	 
	return (
		<div {...useBlockProps.save()} >
			<svg viewBox="0 0 640 400" textAnchor="middle" style={{border:'1px soild black', position:'relative'}}>
				<g>
					{attributes.data.length ? attributes.data.map(({size, x,y,rotate,text})=>(
						<text fontSize={size} transform={`translate(${x}, ${y}) rotate(${rotate})`}>{text}</text>
					)) : null}
				</g>
			</svg>;
		</div>
	)
}

