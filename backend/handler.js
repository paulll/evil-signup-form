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

module.exports.show = async () => {
	if (!connected)
		await connect_promise;
	connected = true;

	// todo: use pug template for this
	try {
		const data = await client.query({text: 'SELECT * FROM public.logs LIMIT 500', rowMode: 'array'});
		const table = data.rows.map(row => `<tr>${row.map(e => `<td>${e}</td>`).join('')}</tr>`).join('');
		const body = `<!DOCTYPE html><html><body><table>${table}</table></body></html>`;
		return {statusCode: 200, body, headers: {"Content-Type": "text/html"}}
	} catch (e) {
		return {statusCode: 200, body: require('util').inspect(e)}
	}

};
