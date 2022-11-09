const express = require('express');
const app = express();
const port = 3000;
const constructPageBody = require('./checkOrder');
const e = require("express");


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
    const pageBody = constructPageBody(reqBody);
    let validation = validate(reqBody)
    console.log(validation)
    if (validation[0])
    {
        response.send(`${pageHead}${pageBody}\n"Мы должны передавать зарос в этом случае"${pageFoot}`);
    }
    else
    {
        let x = arrayToString(validation[1])
        response.send(`${pageHead}${pageBody}${x}\n"Мы должны не передавать зарос в этом случае"${pageFoot}`);

    }
});

function arrayToString(array){
    let result = ''
    array.forEach(x => result += x + '\n')
    return result
}

function validate(reqBody){
    function toDate(dateStr) {
        let parts = dateStr.split("-")
        return new Date(parts[0], parts[1] - 1, parts[2])
    }

    function validatePetType(input){
        return (["dog","cat","tiger"].includes(input)) ? [true,""] : [false, `Вы сказали, что ваш питомец имеет тип ${input}, а в нашем магазине есть только Тигры, Собаки и Кошки`];
    }

    function validateGender(input){
        return (["boy","girl","none"].includes(input)) ? [true,""] : [false,"Наш магазин придерживается традиционных ценностей, а вы указали пол животного, который мы не признаем. Для нас существуют только пол Мaльчик и Девочка"]
    }

    function validateEyeColor(input){
        return (input.length === 7 && input[0] === "#") ? [true,""] : [false,"Предоставленный цвет не в формате HEX (#XXXXXX)"]
    }

    function validateTailLength(input){
        let firstString = "Длина хвоста вне промежутка от 7 до 120"
        let secondString = "Длина хвоста не число"
        return !isNaN(input) ? Number(input) >= 7 && Number(input) <= 120 ? [true,''] : [false,firstString] : [false, secondString]
    }

    function validateName(input){
        return input.length <= 30 && input.length >= 3 ? [true,''] : [false,"Введенное имя должно иметь длину от 3 до 30 символов"]
    }

    function validateDateOfBirth(input){
        if (input.length !== 10){
            return [false,"Дата указана в неверном формате"]
        }
        let parts = input.split('-')
        if (Number(parts[0]) && Number(parts[1]) && Number(parts[2]) && parts[0].length === 4 && parts[1].length === 2 && parts[2].length === 2){
            let oneYear = 1000 * 60 * 60 * 24 * 365
            if (toDate(input) > new Date())
                return [false,"Возможно вы ошиблись в дате, если же нет, то вы (скорее всего) еще не родились"]
            if ((new Date().getTime() - toDate(input).getTime())/oneYear > 120){
                return [false,"Возможно вы ошиблись в дате, если же нет, то вы (скорее всего) уже мертвы"]
            }
            return [true,'']
        }
    }

    function validateEmail(input){
        return input.includes("@") ? [true,''] : [false,"В email адресе должен быть символ @"]
    }

    function validatePhone(input){
        return input[0] === "+" && input.length === 12 && Number(input.slice(1)) ? [true,""] : [false, "Номер телефона не соответсвует стандарту российской федерации"]
    }

    function validateRules(input){
        return input === "true" ? [true,""] : [false,"Вы должны принять правила использования"]
    }

    let exception_messages = []
    exception_messages.push(validatePetType(reqBody["petType"]))
    exception_messages.push(validateGender(reqBody["gender"]))
    exception_messages.push(validateEyeColor(reqBody["eyeColor"]))
    exception_messages.push(validateTailLength(reqBody["tailLength"]))
    exception_messages.push(validateName(reqBody["name"]))
    exception_messages.push(validateDateOfBirth(reqBody["dateOfBirth"]))
    exception_messages.push(validateEmail(reqBody["email"]))
    exception_messages.push(validatePhone(reqBody["phone"]))
    exception_messages.push(validateRules(reqBody["rules"]))

    let isClear = true
    let exceptions = []
    for (let x in exception_messages){
        let message = exception_messages[x]
        if (message[0] === false){
            exceptions.push(message[1])
            isClear = false
        }
    }
    return [isClear, exceptions]

}

