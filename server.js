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
    // const pageBody = constructPageBody(reqBody);

    const validated = dataValidation(reqBody);
    // console.log(Object.keys(validated).length);
    constructValidPageBody(validated);
    const pageBody =
        Object.keys(validated).length == 0 ? constructPageBody(reqBody): constructValidPageBody(validated);

    // console.log(pageBody);
    console.log(reqBody);
    dataValidation(reqBody);
    // console.log(validated.petType);
    response.send(`${pageHead}${pageBody}${pageFoot}`);
});

function dataValidation(requestBody) {
    const conditions = {
        petType: (value) => {
            let arr = ['cat', 'dog', 'tiger'];
            return arr.indexOf(value) != -1;
        },

        gender: (value) => {
            let arr = ['boy', 'girl', 'none'];
            return arr.indexOf(value) != -1;
        },

        eyeColor: (value) => {
            return true;
        },

        name: (value) => {
            const len = value.length;
            return 3 <= len && len <= 50;
        },

        tailLength: (value) => {
            if (isNaN(Number(value))) return false;
            value = Number(value);
            return 7 <= value && value <= 120;
        },

        dateOfBirth: (value) => {
            let today = new Date().getFullYear();
            age =today - ++value.split('-')[0];
            // console.log(today);
            // console.log(value.split('-')[0]);
            return (5 < age && age < 110) ? true : false;

            return true;
        },

        email: (value) => {
            return true;
        },

        phone: (value) => {
            return true;
        },

        rules: (value) => {
            return value === 'true';
        }
    };
    const wrongFields = {};
    for (key in conditions) {
        console.log(key);
        if (!conditions[key](requestBody[key])) 
            wrongFields[key] = requestBody[key];
    }
    console.log(wrongFields);
    return wrongFields;
}

function constructValidPageBody(wrongFields) {
    // let form = document.querySelector('.main-form')
    // console.log(form);
    // for(el in wrongFields){
    //     console.log(el);
    //     let elementByAttribute = document.querySelector('.tailLength');
    //     // document.getElementsByName('tailLength').classList.add('err');
    //     console.log(elementByAttribute);
    //     // form.elements.el
    // }
    let result = '';
    for (let field in wrongFields) {
        result += `<p>Данные, введенные в поле ${field}, некорректны.</p>`;
    }
    return result;
}

