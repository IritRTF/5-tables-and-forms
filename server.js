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
    const valid = validate(reqBody);
    const pageBody = valid === true ? constructPageBody(reqBody) : getMessage();
    console.log(reqBody.body);
    console.log(wrongInputs);
    
    response.send(`${pageHead}${pageBody}${pageFoot}`);
});

function getMessage(){
    let message = '';
    for (let field in wrongInputs) {
        message += `<p>Значение <b>${wrongInputs[field]}</b> в поле <i>${field}</i> некорректно.</p>`;
    }
    return message;
}

const validator = {
    petType: (value)=>{
        return isString(value) ? ['cat' , 'dog' , 'tiger'].indexOf(value) != -1 : false;
    },
    gender: (value)=>{
        return isString(value) ? ['boy' , 'girl' , 'none'].indexOf(value) != -1 : false;
    },
    tailLength : (value) => {
        let num = Number(value);
        return isString(value) ?  7 <= num && num <= 120 : false;
    },
    name : (value) => {
        return isString(value) ?  3 <= value.length &&  value.length <= 50 : false;
    },
    dateOfBirth : (value) => {
        let date = new Date();
        date = date.getTime();
        return isString(value) ? date - new Date(value).getTime() >= 0 : false;
    },
    email: (value) => {
        const email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/i
        return isString(value) ? email.test(value):false
    },
    phone:(value) => {
        const mobilePhoneRegexp = /^(\+?7|8)?9\d{9}$/
        return isString(value )? mobilePhoneRegexp.test(value) :false
    },
    name : (value) => {
        return value === 'true';
    },
};

function isString(value) { 
    return typeof(value) === 'string'; 
}

wrongInputs = {};

function validate(reqBody){
    for ( field in validator){
        if (!validator[field](reqBody[field]))
            wrongInputs[field] = reqBody[field];
    }
    return wrongInputs.length ==0 ;
}