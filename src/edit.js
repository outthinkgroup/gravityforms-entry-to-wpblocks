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

async function convertToP(id, fieldMap) {
	wp.data.dispatch('core/editor').replaceBlock(id, fieldMap.reduce((blocks, { question, answer }) => {
		blocks.push(wp.blocks.createBlock('core/heading', { content: question, level: 3 }))
		blocks.push(wp.blocks.createBlock('core/paragraph', { content: answer }))
		return blocks
	}, []))
}

export default function Edit(props) {
	const { clientId } = props
	const [forms, setForms] = useState([])
	const [formIndex, setFormIndex] = useState(null);
	const [entries, setEntries] = useState([])
	const [entryIndex, setEntryIndex] = useState(null)

	useEffect(() => {
		getForms().then(res => {
			setForms(res)
		})
	}, [])

	async function updateForm(e) {
		const value = e.target.value
		setFormIndex(value)
		const formId = forms[value]?.id
		if (formId) {
			const _entries = await getEntries(forms[value].id)
			setEntries(_entries)
		}
	}
	async function updateEntry(e) {
		const index = e.target.value
		setEntryIndex(index)
	}
	function sendToConverter() {
		const form = forms[formIndex]
		const entry = entries[entryIndex]
		const fieldMap = form.fields.map((field) => {
			const answer = entry[field.id]
			return {
				question: field.label,
				answer,
			}
		})
		convertToP(clientId, fieldMap)
	}
	let entry = null
	if (entryIndex) {
		entry = entries[entryIndex]
	}

	if (!forms.length) return <p>Loading...</p>
	return (
		<div className="wp-block-gfetc">
			<div className="selector-wrapper">
				<select onChange={updateForm} value={formIndex}>
					<option value={null}>Select A Form</option>
					{forms.map((form, index) => (
						<option value={index} key={form.id}>{form.title}</option>
					))}
				</select>
				{entries.length ? (
					<select onChange={updateEntry} value={entryIndex}>
						<option value={null}>Select An Entry</option>
						{entries.map((entry, index) => (
							<option value={index} key={entry.id}>Entry: {entry.id}</option>
						))}
					</select>
				) : null}
			</div>
			{entry ? (
				<div className="previewer-wrapper" >
					<button onClick={sendToConverter}>Convert</button>
					<div>
						{Object.entries(entry).map(([key, value]) => (
							<div style={{ gap: 20, display: 'flex', padding: '.5rem', borderBottom: `1 solid #ccc`, }} key={key}>
								<div style={{ fontWeight: 'bold' }}>{key}</div>
								<div>{value}</div>
							</div>
						))}
					</div>
				</div>
			) : null}
		</div>
	);
}

async function getForms() {
	const { url } = window.wp.ajax.settings
	const data = {}
	const res = fetch(`${url}?action=gfetc_forms`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	}).then(res => res.json())
	return res
}

async function getEntries(id) {
	const { url } = window.wp.ajax.settings
	const data = {
		form_id: id
	}
	const res = await fetch(`${url}?action=gfetc_gf_entries`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	}).then(res => res.json())
	console.log(res)
	return res
}
// TODO: This could be used to add extra settings to the block
//	like set the some attributes of the headings and paragraph
// const { createHigherOrderComponent } = wp.compose;
// const { InspectorControls } = wp.blockEditor;
// const { PanelBody } = wp.components;
//
// const withInspectorControls = createHigherOrderComponent( ( BlockEdit ) => {
//     return ( props ) => {
// 				console.log({...props})
// 				if(props.name !== 'create-block/todo-list') return <BlockEdit {...props} />
//         return (
//             <>
//                 <BlockEdit { ...props } />
//                 <InspectorControls>
//                     <PanelBody>My custom control</PanelBody>
//                 </InspectorControls>
//             </>
//         );
//     };
// }, 'withInspectorControl' );
//
// wp.hooks.addFilter(
//     'editor.BlockEdit',
//     'my-plugin/with-inspector-controls',
//     withInspectorControls
// );
//
