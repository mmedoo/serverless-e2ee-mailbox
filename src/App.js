import Import from "./import/import"
import Export from "./export/export"
import "./style.css"
import { useState } from "react";

function App() {

	const [shown, setShown] = useState("im");

	const [output, setOutput] = useState({
		loading: false,
		text: ""
	});

	const changeShown = (e) => {
		setShown(e.target.innerText === "Import" ? "im" : "ex");
	}

	return (
		<>
			<div id="header">
				<div onClick={changeShown} className={`${shown === "im" ? "active" : ""}`}>Import</div>
				<div onClick={changeShown} className={`${shown === "ex" ? "active" : ""}`}>Export</div>
			</div>
			
			<div id="wrap">
				<Import setOutput={setOutput} shown={shown} />
				
				<Export setOutput={setOutput} shown={shown} />
				
				{output.loading && <div id="display" className="loading"></div>}

				{!output.loading && <div id="display">{output.text}</div>}
			</div>
		</>
	);
}



export default App;