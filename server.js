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
    const pageBody = constructPageBody(reqBody);

    console.log(request.body);

    response.send(`${pageHead}${pageBody}${pageFoot}`);
    if (reqBody.petType != "cat" && reqBody.petType != "dog" && reqBody.petType != "tiger")
        response.send("Неверный тип питомца");
    if (reqBody.gender != "boy" && reqBody.petType != "girl")
        response.send("Неверный пол питомца");
    if (reqBody.tailLength < 7 || reqBody.tailLength > 120)
        response.send("Неверная длина хвоста питомца");
    if (reqBody.name.length < 3 || reqBody.name.length > 50)
        response.send("Неверное имя питомца");
    if (reqBody.rules == false)
        response.send("Требуется согласие с условиями");
    else
        response.send(`${pageHead}${pageBody}${pageFoot}`);
});


