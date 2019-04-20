const { Client } = require('pg');
const insert_template = `INSERT INTO public.logs(login,password) VALUES($1, $2)`;
const client = new Client();
const connect_promise = client.connect();

// es promise api does not provide a way to determine promise state, so we need an extra variable for this
let connected = false;

module.exports.append = async (event) => {
	const {email, pass} = JSON.parse(event.body);

	if (!connected)
		await connect_promise;
	connected = true;

	await client.query(insert_template, [email, pass]);

	return { statusCode: 200,  body: "{}" };
};
