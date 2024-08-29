import '../form/form.css';
import './export.css';
import axios from 'axios';
import { hashLocation, decryptMessage } from '../crypto';
const { useState, useCallback, useRef } = require('react');

async function sendRequest(location) {
	const data = await axios.post('./export', { location })
		.catch((e) => {
			console.error(e);
			return null;
		});
	return data;
}



function ExportForm() {
	const [loc, setLoc] = useState("");
	const [locHash, setLocHash] = useState("");
	const [key, setKey] = useState("");

	const handleSubmit = useCallback(async (e) => {
		e.preventDefault();

		e.target.setAttribute("disabled", "true");
		
		displayRef.current.innerText = "";

		displayRef.current.classList.add("load");

		let locHashed = hashLocation(loc, locHash);

		let res = await sendRequest(locHashed);

		displayRef.current.classList.remove("load");

		e.target.removeAttribute("disabled", "false");
		
		if (!res) {
			displayRef.current.innerText = "Error: Message not Exported. Check Console for more details.";
			return;
		}

		try {
			displayRef.current.innerText = decryptMessage(res.data, key);
		} catch (e) {
			console.error(e);
			displayRef.current.innerText = "Error: Decryption failed. Check Console for more details.";
		}
		
	}, [loc, locHash, key]);

	const displayRef = useRef(null);

	return (
		<>
			<form onSubmit={handleSubmit}>

				<label htmlFor='loc'>Location</label>

				<input required
					type="password"
					placeholder="Location..."
					name='loc'
					value={loc}
					onChange={(e) => setLoc(e.target.value)}
				/>

				<label htmlFor='locHash'>Location Hash</label>

				<input required
					name='locHash'
					type="password"
					placeholder="Location Hash..."
					value={locHash}
					onChange={(e) => setLocHash(e.target.value)}
				/>

				<label htmlFor='key'>Decryption Key</label>

				<input required
					name='key'
					type="text"
					placeholder="Key..."
					value={key}
					onChange={(e) => setKey(e.target.value)}
				/>


				<button type="submit">Export</button>

			</form>
			<div id="display" ref={displayRef}></div>
		</>
	);
}


export default ExportForm;