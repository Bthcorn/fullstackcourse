const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const jwt = require('jsonwebtoken'); // npm i jsonwebtoken
const dotenv = require('dotenv'); // npm i dotenv
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const bookController = require('./controllers/BookController');
app.use('/book', bookController);

app.get('/', (req, res) => {
    res.send('Hello World');
});

// app.get('/hello/:name', (req, res) => {   
    //     res.send('Hello ' + req.params.name);
    // });
    
    app.get('/hi/:name/:age', (req, res) => {
        // res.send('Hi ' + req.params.name + ', you are ' + req.params.age + ' years old');
    res.send(`Hi ${req.params.name}, you are ${req.params.age} years old`);
});

app.post('/hello', (req, res) => {
    res.send(req.body);
});

app.put('/myPut', (req, res) => {
    res.send('PUT request');
});

app.put('/updateCustomer/:id', (req, res) => {
    // const id = req.params.id;
    const id = parseInt(req.params.id);
    const data = req.body;
    
    // res.send('id = ' + id + ', data = ' + JSON.stringify(data));
    res.send({ id, data });
});

app.delete('/deleteCustomer/:id', (req, res) => {
    res.send('id = ' + req.params.id);
});

app.get('/book/list', async (req, res) => {
    const data = await prisma.book.findMany(); // SELECT * FROM "Book"
    res.send({data : data});
});

app.post('/book/create', async (req, res) => {
    const data = req.body;
    const result = await prisma.book.create({
        data: data
    }); // INSERT INTO "Book" (params) VALUES (...)
    res.send({result : result});
});

app.post('/book/createManual', async (req, res) => {
    const result = await prisma.book.create({
        data: {
            isbn: '1004',
            name: 'Flutter',
            price: 50
        }
    }); // INSERT INTO "Book" (params) VALUES (...)
    res.send({result : result});
});

app.put('/book/update/:id', async (req, res) => {
    try {
        await prisma.book.update({
            data: {
                isbn: "10022",
                name: 'test update',
                price: 900
            },
            where: {
                id: parseInt(req.params.id)
            }
        })
        
        res.send({ message: 'Update book success' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.delete('/book/remove/:id', async (req, res) => {
    try {
        await prisma.book.delete({
            where: {
                id: parseInt(req.params.id)
            }
        });
        res.send({ message: 'Delete book success' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.post('/book/search', async (req, res) => {
    try {
        const keyword = req.body.keyword;
        const data = await prisma.book.findMany({
        where: {
            // OR: [
                //     { name: { contains: keyword } }, //LIKE %keyword%
                //     { isbn: { contains: keyword } }
                // ]
                name: { contains: keyword }
            }
        });
        res.send({ result: data });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.post('/book/startsWith', async (req, res) => {  
    try {
        const keyword = req.body.keyword;
        const data = await prisma.book.findMany({
            where: {
                name: { startsWith: keyword }
                
            }
        });
        res.send({result: data});
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.post('/book/endsWith', async (req, res) => {  
    try {
        const keyword = req.body.keyword;
        const data = await prisma.book.findMany({
            where: {
                name: { endsWith: keyword }
                
            }
        });
        res.send({result: data});
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/book/orderBy', async (req, res) => {
    try {
        const data = await prisma.book.findMany({
            orderBy: {
                price: 'desc'
            }
        });
        res.send({result: data});
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/book/gt', async (req, res) => {
    try {
        const data = await prisma.book.findMany({
            where: {
                price: {
                    gt: 900
                }
            }
        });
        res.send({result: data});
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/book/lt', async (req, res) => {
    try {
        const data = await prisma.book.findMany({
            where: {
                price: {
                    lt: 1000
                }
            }
        });
        res.send({result: data});
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/book/notNull', async (req, res) => {
    try {
        const data = await prisma.book.findMany({
            where: {
                detail: {
                    not: null
                }
            }
        });
        res.send({result: data});
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/book/isNUll', async (req, res) => {
    try {
        const data = await prisma.book.findMany({
            where: {
                detail: null
            }
        });
        res.send({result: data});
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/book/between', async (req, res) => {
    try {
        const data = await prisma.book.findMany({
            where: {
                price: {
                    gte: 900, //>= 900
                    lte: 1500 //<= 1500
                }
            }
        });
        res.send({result: data});
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/book/sum', async (req, res) => {
    try {
        const data = await prisma.book.aggregate({
            _sum: {
                price: true
            }
        });
        res.send({result: data});
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/book/max', async (req, res) => {
    try {
        const data = await prisma.book.aggregate({
            _max: {
                price: true
            }
        });
        res.send({result: data});
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/book/min', async (req, res) => {
    try {
        const data = await prisma.book.aggregate({
            _min: {
                price: true
            }
        });
        res.send({result: data});
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/book/average', async (req, res) => {
    try {
        const data = await prisma.book.aggregate({
            _avg: {
                price: true
            }
        });
        res.send({result: data});
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/book/findYearMonthDay', async (req, res) => {
    try {
        const data = await prisma.book.findMany({
            where: {
                registerDate: new Date('2024-05-08')
            }
        });
        res.send({result: data});
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/book/findYearMonth', async (req, res) => {
    try {
        const data = await prisma.book.findMany({
            where: {
                registerDate: {
                    gte: new Date('2024-05-01'),
                    lte: new Date('2024-05-31')
                }
            }
        });
        res.send({result: data});
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/book/findYear', async (req, res) => {
    try {
        const data = await prisma.book.findMany({
            where: {
                registerDate: {
                    gte: new Date('2024-01-01'),
                    lte: new Date('2024-12-31')
                }
            }
        });
        res.send({result: data});
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/user/createToken', (req, res) => {
    try {
        const secret = process.env.TOKEN_SECRET;
        const payload = {
            id: 100,
            name: 'Bowornthat',
            level: 'admin'
        }
        const token = jwt.sign(payload, secret, { expiresIn: '1h' });
        
        res.send({ token: token });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/user/verifyToken', (req, res) => {
    try {
        const secret = process.env.TOKEN_SECRET;
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwLCJuYW1lIjoiQm93b3JudGhhdCIsImxldmVsIjoiYWRtaW4iLCJpYXQiOjE3MTU0Mzg4NTIsImV4cCI6MTcxNTQ0MjQ1Mn0.KRqVKR8zJkbWsVl3lUUEZbXD7BVzinKyf49k7glbnaw';
        const decoded = jwt.verify(token, secret);
        res.send({ result: decoded });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

function checkSignIn(req, res, next) {
    try {
        const secret = process.env.TOKEN_SECRET;
        const token = req.headers['authorization'];
        const result = jwt.verify(token, secret);

        if (result != undefined) {
            next();
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

app.get('/user/info', checkSignIn, (req, res, next) => {
    try {
        res.send({ message: 'Welcome to the system' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/oneToOne' , async (req, res) => {
    try {
        const data = await prisma.orderDetail.findMany({
            include: {
                Book: true
            }
        });
        res.send({result: data});
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/oneToMany' , async (req, res) => {
    try {
        const data = await prisma.book.findMany({
            include: {
                OrderDetail: true
            }
        });
        res.send({result: data});
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/multiModel' , async (req, res) => {
    try {
        const data = await prisma.customer.findMany({
            include: {
                Order: {
                    include: {
                        OrderDetail: true
                    }
                }
            }
        });
        res.send({result: data});
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.listen(3001, () => {
    console.log('Listening on port 3001');
});