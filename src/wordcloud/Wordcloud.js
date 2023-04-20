import * as d3 from "d3";
import { useMemo, useEffect, useState } from "@wordpress/element"

import d3Cloud from "d3-cloud"

function buildCloud(words){
	console.log(words)
	const data = Array.from(d3.rollup(words, group => group.length, d => d).entries()).map(([w, size]) => ({ text: w, size }))
	let wordData = [];
	const cloud = d3Cloud()
		.size([640, 400])
		.words(data)
		.rotate(0)
		.padding(5)
		.fontSize((d) => Math.sqrt(d.size) * (400 / data.length))
		.on('word', ({ size, x, y, rotate, text }) => {
				console.log(text)
				wordData.push({ size, x, y, rotate, text })
		})
		.on('end', (ws) => {
			console.log('data:',ws)
		})
	cloud.start()
	console.log({wordData,data})
	return wordData
}
function Wordcloud({ words, setter, attrs }) {
	const svgWordData = useMemo(()=>buildCloud(words), [ words ])
	useEffect(()=>{
		setter({data:svgWordData})
	},[ svgWordData ])
	return <svg viewBox="0 0 640 400" textAnchor="middle" style={{ border: '1px soild black' }}>
		<g>
			{svgWordData.length ? svgWordData.map(({ size, x, y, rotate, text }) => (
				<text fontSize={size} transform={`translate(${x}, ${y}) rotate(${rotate})`}>{text}</text>
			)) : null}
		</g>
	</svg>;
	// return <p>{words.join(', ')}</p>
}

export default Wordcloud
