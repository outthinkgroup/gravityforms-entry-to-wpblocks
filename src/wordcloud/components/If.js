export default function If({children, condition, ifNot}){
	if(!condition && !ifNot) return null;
	if(!condition){
		const Comp = ifNot
		return <Comp/>
	}
	return <>{children}</>
}
