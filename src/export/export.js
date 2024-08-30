import axios from 'axios';
import { hashLocation, decryptMessage } from '../crypto';
const { useState, useCallback } = require('react');


async function sendRequest(location) {
	const data = await axios.post('./export', { location })
		.catch((e) => {
			console.error(e);
			return null;
		});
	return data;
}


function ExportForm({ shown, setOutput }) {
	const [loc, setLoc] = useState("");
	const [locHash, setLocHash] = useState("");
	const [key, setKey] = useState("");

	const handleSubmit = useCallback(async (e) => {
		e.preventDefault();

		e.target.setAttribute("disabled", "true");

		setOutput({ loading: true });
		
		let locHashed = hashLocation(loc, locHash);

		let res = await sendRequest(locHashed);

		e.target.removeAttribute("disabled", "false");

		if (!res) {
			setOutput({ text: "Error: Message not Exported. Check Console for more details." });
			return;
		}

		try {
			setOutput({ text: decryptMessage(res.data, key) });
			e.target.reset();
		} catch (e) {
			console.error(e);
			setOutput({text: "Error: Decryption failed. Check Console for more details."});
		}

	}, [loc, locHash, key]);

	return (
		<form className={`${shown === "ex" ? "" : "off"}`} onSubmit={handleSubmit}>

			<label htmlFor='loc'>Location</label>

			<input required
				type="password"
				placeholder="Location..."
				name='loc'
				onChange={(e) => setLoc(e.target.value)}
			/>

			<label htmlFor='locHash'>Location Key</label>

			<input required
				name='locHash'
				type="password"
				placeholder="Location Hash..."
				onChange={(e) => setLocHash(e.target.value)}
			/>

			<label htmlFor='key'>Decryption Key</label>

			<input required
				name='key'
				type="password"
				placeholder="Key..."
				onChange={(e) => setKey(e.target.value)}
			/>

			<button type="submit">Export</button>

		</form>
	);
}


export default ExportForm;