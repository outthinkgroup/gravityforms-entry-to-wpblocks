import {useState} from "@wordpress/element"
export default function useAjax(action, defaultData=null){
	const [error,setError] = useState(null)	
	const [data, setData] = useState(defaultData)
	const [loading, setLoading] = useState(false)

	async function fetcher(data){
		const { url } = window.wp.ajax.settings
		setLoading(true)
		setError(null)
		const res = await fetch(`${url}?action=${action}`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		}).then(res => res.json()).catch(res=>{
			setError(res)
		})
		setLoading(false)
		setData(res)
	}

	return [fetcher,{data,loading,error}]
}
