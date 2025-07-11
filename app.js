const express = require('express');
const app = express();
const routerUsers = require('./routes/userRoutes');
const routerOrders = require('./routes/orderRoutes');
const routerAuth = require('./routes/authRoutes');
const routerProduct = require('./routes/productRoutes');

app.use(express.json());

app.use('/api/auth', routerAuth);
app.use('/api/users', routerUsers);
app.use('/api/orders', routerOrders);
app.use('/api/products', routerProduct);

app.listen(3000, () => {
    console.log("server đang chạy!");
})