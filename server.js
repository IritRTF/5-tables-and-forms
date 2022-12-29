const express = require('express');
const app = express();
const port = 3000;
const constructPageBody = require('./checkOrder');

const pageHead = `
<!DOCTYPE html>
<html lang="ru">
<head>
<title>Результат заказа питомца</title>
<link rel="stylesheet" href="/styles.css">
</head>
<body>
<main>
<h1>Результат заказа питомца</h1>
`;

const pageFoot = `
<a href="/">⃪ Вернуться к форме заказа</a>
</main>
</body>
</html>
`;

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }

    console.log(`server is listening on ${port}`);
});

app.use(express.static('static'));
app.use(express.urlencoded({ extended: true }));

app.post('/pets/orders', (request, response) => {
    const reqBody = request.body;
    const validated = validateInputs(reqBody);
    const pageBody =
        validated === true
            ? constructPageBody(reqBody)
            : constructValidatedPageBody(validated);
    // const pageBody = constructPageBody(reqBody);

    console.log(request.body);

    response.send(`${pageHead}${pageBody}${pageFoot}`);
});

const NAMING = {
    petType: 'Тип питомца',
    gender: 'Пол',
    tailLength: 'Длина хвоста',
    name: 'Имя',
    eyeColor: 'Цвет глаз',
    dateOfBirth: 'Дата рождения',
    email: 'Email',
    phone: 'Телефон',
    rules: 'Соглашение',
};

function validateInputs(requestBody) {
    const validators = {
        petType: (value) => {
            if (typeof value !== 'string') return false;
            return (
                ['cat', 'dog', 'tiger'].filter((e) => e === value).length !== 0
            );
        },
        gender: (value) => {
            if (typeof value !== 'string') return false;
            return ['boy', 'girl'].filter((e) => e === value).length !== 0;
        },
        tailLength: (value) => {
            if (typeof value !== 'string') return false;
            if (isNaN(Number(value))) return false;
            value = Number(value);
            return 7 <= value && value <= 120;
        },
        name: (value) => {
            if (typeof value !== 'string') return false;
            return 3 <= value.length && value.length <= 30;
        },
        eyeColor: (value) => {
            if (typeof value !== 'string') return false;
            return value.match(/#?[0-9A-Fa-f]{6}/g);
        },
        dateOfBirth: (value) => {
            if (typeof value !== 'string') return false;
            return value.match(
                /^((0[1-9]|1[012]|[1-9])[- /.](0[1-9]|[12][0-9]|3[01]|[1-9])[- /.](19|20)\d\d|(19|20)\d\d[- /.](0[1-9]|1[012]|[1-9])[- /.](0[1-9]|[12][0-9]|3[01]|[1-9]))$/g
            );
        },
        email: (value) => {
            if (typeof value !== 'string') return false;
            return value.match(
                /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
            );
        },
        phone: (value) => {
            if (typeof value !== 'string') return false;
            return value.match(
                /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/
            );
        },
        rules: (value) => {
            if (typeof value !== 'string') return false;
            return value === 'true';
        },
    };
    const wrongFields = {};
    for (key in validators) {
        if (!validators[key](requestBody[key]))
            wrongFields[key] = requestBody[key];
    }
    return Object.entries(wrongFields).length !== 0 ? wrongFields : true;
}

function constructValidatedPageBody(wrongFields) {
    let result = '';
    for (let field in wrongFields) {
        result += `<p>Значение <b>${wrongFields[field]}</b> в поле <i>${NAMING[field]}</i> некорректно.</p>`;
    }
    return result;
}