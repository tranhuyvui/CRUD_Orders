const express = require('express');
const app = express();
const routerUsers = require('./routes/userRoutes');
const routerOrders = require('./routes/orderRoutes');

app.use(express.json());

app.use('/api/users', routerUsers);
app.use('/api/orders', routerOrders);

app.listen(3000, () => {
    console.log("server đang chạy!");
})