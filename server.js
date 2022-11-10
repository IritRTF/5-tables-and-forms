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
<div class="overlay"></div>
<h1>Результат заказа питомца</h1>
`;

const pageFoot =
    `
<a href="/" class="go-back">Вернуться</a>
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
    const pageBody = validate(request.body);

    console.log(request.body);

    response.send(`${pageHead}${pageBody}${pageFoot}`);
});

function validate(reqBody) {
    const NAMEREGEX = /^([a-zа-я]+[\s]*)*$/i;
    const PHONEREGEX = /^((\+7)|8)[9]\d{9}$/;

    if (!NAMEREGEX.test(reqBody.name))
        return `<p class="error">Имя должно состоять только из букв и не начинаться с пробела!</p>`;

    if (!PHONEREGEX.test(reqBody.phone))
        return `<p class="error">Номер телефона должен быть в виде 89000000000 или +79000000000!</p>`;

    const date = new Date(reqBody.dateOfBirth);
    const dateNow = new Date();
    if (date > dateNow)
        return `<p class="error">Дата рождения не может быть позднее сегодняшнего дня!</p>`;

    return constructPageBody(reqBody);
}