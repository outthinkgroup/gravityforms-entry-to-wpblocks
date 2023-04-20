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
import { useBlockProps } from '@wordpress/block-editor';

import WordCloud from "./Wordcloud"
import QuestionPicker from "./components/QuestionPicker"

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';
import If from './components/If';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */


export default function Edit({ isSelected, attributes, setAttributes }) {
	const [words, setWords] = useState(attributes.words)

	async function setIds({formId,questionId}){
		const res = await getAnswers({formId, questionId})
		const w = res.map(({meta_value})=>{
			return meta_value
		})
		setWords(w)
		setAttributes({formId})
		setAttributes({questionId})
		setAttributes({words:w})
	}
	useEffect(()=>{console.log(attributes)},[attributes])

	return (
		<div {...useBlockProps()} >
			<If condition={isSelected}>
				<QuestionPicker setIds={setIds} formId={attributes.formId} questionId={attributes.questionId} />
			</If>
			<If condition={words.length} ifNot={()=><p>Select a form and question to see results</p>}>
				<WordCloud attrs={attributes} words={words} setter={setAttributes} />
			</If>
		</div>
	)
}

async function getAnswers({formId,questionId}){
	const { url } = window.wp.ajax.settings
	const data = {
		form_id:formId,
		question_id:questionId,
	}
	const res = fetch(`${url}?action=gfetc_gf_answers`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	}).then(res => res.json())
	return res

}
