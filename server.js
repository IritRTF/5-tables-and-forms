const express = require('express');
const app = express();
const port = 3000;
const constructPageBody = require('./checkOrder');


const pageHead =
    `
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

const pageFoot =
    `
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
    const valid = validateErrors(reqBody);
    const pageBody = valid === true ? constructPageBody(reqBody) : getErrors();
    console.log(reqBody.body);
    console.log(errors);

    response.send(`${pageHead}${pageBody}${pageFoot}`);
});

let errors = {};

let validate = {
    petType: (value) => { return isString(value) ? ['cat', 'dog'].indexOf(value) != -1 : false; },
    gender: (value) => { return isString(value) ? ['boy', 'girl'].indexOf(value) != -1 : false; },
    tailLength: (value) => { return isString(value) ? 7 <= Number(value) && Number(value) <= 120 : false; },
    name: (value) => { return isString(value) ? 3 <= value.length && value.length <= 50 : false; },
    dateOfBirth: (value) => {
        let date = new Date();
        date = date.getTime();
        return isString(value) ? date - new Date(value).getTime() >= 0 : false;
    },
    email: (value) => {
        let email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/i
        return isString(value) ? email.test(value) : false
    },
    phone: (value) => {
        let phone = /^(\+?7|8)?9\d{9}$/
        return isString(value) ? phone.test(value) : false
    },
    name: (value) => { return value === 'true'; },
};

function isString(value) { return typeof (value) === 'string'; }

function validateErrors(reqBody) {
    for (i in validate) {
        if (!validate[i](reqBody[i])) errors[i] = reqBody[i];
    }

    return errors.length == 0;
}

function getErrors() {
    let messageError = '';
    for (let i in errors) { messageError += `<p>Значение <b>${errors[i]}</b> в поле <i>${i}</i> некорректно.</p>`; }
    return messageError;
}