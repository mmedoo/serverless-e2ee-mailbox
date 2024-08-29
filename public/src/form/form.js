import './form.css';
import axios from 'axios';
import { hashLocation, encryptMessage } from '../crypto';
const { useState, useCallback } = require('react');


async function sendData(location, message) {
	await axios.post('./import',
		{ location, message })
		.then(() => alert("Message Imported Successfully"))
		.catch((e) => {
			console.error(e);
			alert("Message is NOT Imported. Check Console for details");
		})
}


function Form() {
	const [loc, setLoc] = useState("");
	const [locHash, setLocHash] = useState("");
	const [message, setMessage] = useState("");
	const [key, setKey] = useState("");

	const handleSubmit = useCallback(async (e) => {
		e.preventDefault();

		e.target.setAttribute("disabled", "true");
		
		let locHashed = hashLocation(loc, locHash);
		let enMsg = encryptMessage(message, key);
		
		await sendData(locHashed, enMsg);

		e.target.setAttribute("disabled", "false");
	}, [loc, message, locHash, key]);

	return (
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
				type="text"
				placeholder="Location Hash..."
				value={locHash}
				onChange={(e) => setLocHash(e.target.value)}
			/>

			<label htmlFor='message'>Message</label>
			
			<textarea
				required
				name='message'
				placeholder="Message..."
				value={message}
				onChange={(e) => setMessage(e.target.value)}
			/>

			<label htmlFor='key'>Encryption Key</label>

			<input required
				name='key'
				type="password"
				placeholder="Key..."
				value={key}
				onChange={(e) => setKey(e.target.value)}
			/>


			<button type="submit">Import</button>
		</form>
	);
}


export default Form;