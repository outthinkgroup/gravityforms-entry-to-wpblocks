import {useState, useEffect} from '@wordpress/element'
import If from './If';
const empty = [];
export default function QuestionPicker({formId, questionId, setIds}){
	const [forms, setForms] = useState([])
	const [questions, setQuestions] = useState([])

	const [_formId, _setFormId] = useState(formId)
	const [_questionId, _setQuestionId] = useState(questionId)
	
	useEffect(()=>{
		getForms().then(res=>setForms(res))	
	}, empty)

	if(!forms.length) return <p>Loading Forms...</p>

	return <form onSubmit={(e)=>{
		e.preventDefault();
		setIds({formId:_formId, questionId:_questionId})
	}}>
		<select value={_formId} name="form_id" onChange={async (e)=>{
			_setFormId(e.target.value)
			const form = forms.find(f=>f.id == e.target.value)
			setQuestions(form.fields)
		}}>
			<option value="">choose form</option>
			{forms.map(({id, title})=>{
				return <option value={id}>{title}</option>
			})}	
		</select>

		<select name="question_id" value={_questionId} onChange={(e)=>_setQuestionId(e.target.value)}>
			<option value="">choose question</option>
			{questions.map(({id, label})=>{
				return <option value={id}>{label}</option>
			})}	
		</select>
		<If condition={_questionId}>
			<button type="submit">Submit</button>
		</If>
	</form>
}

export async function getForms() {
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

