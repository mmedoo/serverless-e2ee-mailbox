import axios from 'axios';
import { hashLocation, encryptMessage } from '../crypto';
const { useState, useCallback } = require('react');


async function sendData(location, message) {
	return await axios.post('./import',
		{ location, message })
		.then(() => 200)
		.catch((e) => {
			console.error(e);
			return (500);
		})
}


function Form({ shown, setOutput }) {
	const [loc, setLoc] = useState("");
	const [locHash, setLocHash] = useState("");
	const [message, setMessage] = useState("");
	const [key, setKey] = useState("");

	const handleSubmit = useCallback(async (e) => {
		e.preventDefault();

		setOutput({ loading: true });

		e.target.setAttribute("disabled", "true");

		let locHashed = hashLocation(loc, locHash);
		let enMsg = encryptMessage(message, key);

		let requestStatus = await sendData(locHashed, enMsg);
		let outputString;

		switch (requestStatus) {

			case 200:
				outputString = (<text>
					Message Imported Successfully
					<br />
					This is how your message is stored in the database:
					<br />
					Location:
					<br />
					{locHashed}
					<br />
					<br />
					Message:
					<br />
					{enMsg}
				</text>);

				e.target.reset();
				break;

			case 500:
				outputString = "Message is NOT Imported. Check Console for details";
				break;
			default:
				break;
		}

		e.target.setAttribute("disabled", "false");

		setOutput({ text: outputString });

	}, [loc, message, locHash, key]);

	return (
		<form className={`${shown === "im" ? "" : "off"}`} onSubmit={handleSubmit}>

			<label htmlFor='loc'>Location</label>

			<input required
				type="password"
				placeholder="Location..."
				name='loc'
				value={loc}
				onChange={(e) => setLoc(e.target.value)}
			/>

			<label htmlFor='locHash'>Location Key</label>

			<input required
				name='locHash'
				type="password"
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