const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true}));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.use(express.static('public'));


const authRouter = require('./routers/auth');
const productsRouter = require('./routers/products');

app.use('/auth', authRouter);
app.use('/products', productsRouter);

app.use((req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/auth/login');
    }
});

app.listen(3000, () => {
    console.log('server is running on port 3000');
});

const express = require('express');
const router = express.Router();

const users = []


router.get('/login', (req, res) => {
    res.render('login');

});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        req.session.loggedIn = true;
        req.session.user = user;
        res.redirect('/products');
    } else {
        res.redirect('/auth/login');
    }
});


router.get('/register', (req, res) => {
    res.render('register');

});


router.post('/register', (req, res) => {
    const { email, password } = req.body;
    const newUser = { email, password, role: 'usuario'};
    if (email === 'adminCoder@coder.com'    
    && password === 'adminCod3r123') {
        newUser.role = 'admin';
    }
    users.push(newUser);
    res.redirect('/auth/login');
});


router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
});

module.exports = router;

const express = require('express');
const routers = express.Router();

router.get('/', (req, res) => {
    if (req.session.loggedIn) {
        res.render('products', { user: req.session.user });
    } else {
        res.redirect('/auth/login');
    }
});
