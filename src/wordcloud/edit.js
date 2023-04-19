/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useState, useEffect } from '@wordpress/element'
import {useBlockProps} from '@wordpress/block-editor';

import WordCloud from "./Wordcloud"

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */


export default function Edit({isSelected,attributes, setAttributes}) {
	const [ words, setWords ] = useState(attributes.words)
	
	return (
		<div {...useBlockProps()} >
			{isSelected ? 
				<form onSubmit={(e)=>{
					e.preventDefault()
					const formData = new FormData(e.currentTarget)
					setWords(ws=>{
						return [...ws, formData.get('word')]
					})
				}}>
					<input type='text' name='word' />
					<button>add</button>
				</form>
				: null}
			<WordCloud attrs={attributes} words={words} setter={setAttributes} />
		</div>
	)
}

