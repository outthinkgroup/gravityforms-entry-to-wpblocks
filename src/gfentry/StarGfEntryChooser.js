import { debounce } from "@wordpress/compose"
import { useState, useEffect  } from '@wordpress/element'
import {Button, SelectControl, ComboboxControl } from "@wordpress/components"
import metadata from './block.json';

function convertToP(id, fieldMap) {
	wp.data.dispatch('core/editor').replaceBlock(id, fieldMap.reduce((blocks, { question, answer }) => {
		blocks.push(wp.blocks.createBlock('core/heading', { content: question, level: 3 }))
		blocks.push(wp.blocks.createBlock('core/paragraph', { content: answer }))
		return blocks
	}, []))
}

export default function StarGfEntryChooser(props) {
	const { clientId } = props

	const [forms, setForms] = useState([])
	const [formIndex, setFormIndex] = useState(null)
	useEffect(() => {
		getForms().then(res => {
			setForms(res)
		})
	}, [setForms])

	const [initialStars, setStars] = useState([]);
	const [isFetchingStars, setIsFetching] = useState(false)
	async function fetchStars(query, formId) {
		setIsFetching(true)
		const res = await fetcher(query, formId)
		setIsFetching(false)
		return res
	}

	const [starIndex, setEntryIndex] = useState(null)
	const [entry, setEntry] = useState(undefined)
	const [isFetchingEntry, setIsFetchingEntry] = useState(false)

	function convertToBlocks() {
		const form = forms[formIndex]
		const fieldMap = form.fields.map((field) => {
			const answer = entry[field.id]
			return {
				question: field.label,
				answer,
			}
		})
		convertToP(clientId, fieldMap)
	}

	return (
		<div className="wp-block-gfetc-wrapper">
			<div class="wp-block-gfetc" >
				<h4 className="wp-block-gfetc__title">{metadata.title}</h4>
				{forms.length ? (
					<div className="select-wrapper">
						<SelectControl
							label={"Choose a Form"}
							value={formIndex}
							onChange={async (index) => {
								setFormIndex(index)
								await fetchStars(undefined, forms[index]?.id).then(setStars)
							}}
						>
							<option value={null}>Select a form</option>
							{forms.map((form, index) => {
								return <option key={form.id} value={index}>{form.title}</option>
							})}
						</SelectControl>
					</div>
				) : (<p>Loading...</p>)}

				{formIndex != null ? (
					<div className="select-wrapper">
						<ComboboxControl
							label={`Choose a star`}
							value={starIndex}
							onChange={async (i) => {
								setEntryIndex(i)
								setIsFetchingEntry(true)
								const entry = await getEntry(parseInt( initialStars[i].forms[forms[formIndex].id] ))
								setIsFetchingEntry(false)
								setEntry(entry)
							}}
							onFilterValueChange={(s) => {
								debounce(() => {
									if (s.length >= 3) {
										return fetchStars(s, forms[formIndex]?.id).then(setStars)
									}
								}, 400)()
							}}
							options={initialStars.map((s, index) => ({ value: index, label: s.email }))}
						/>
						{isFetchingStars ? <p>Loading more...</p> : null}
					</div>
				) : null}

				{(entry || isFetchingEntry) ? (
					<div>
						<Button
							disabled={isFetchingEntry}
							variant="primary"
							style={{color:'white'}}
							onClick={convertToBlocks}
						>
							{ isFetchingEntry ? "Loading Entry..." : "Convert to Blocks" }
						</Button>
					</div>
				) : null}
			</div>
		</div>
	)
}

async function fetcher(query, formId) {
	const { url } = window.wp.ajax.settings
	const params = {
		query,
		limit: 10,
	}
	if (formId) {
		params.form_id = formId
	}
	const res = await fetch(`${url}?action=gfetc_get_stars`, {
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(params),
		method: "POST"
	}).then(res => res.json())
	return res;
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

async function getEntry(id) {
	const { url } = window.wp.ajax.settings
	const data = {
		entry_id: id
	}
	const res = await fetch(`${url}?action=gfetc_gf_entry`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	}).then(res => res.json())
	return res
}
