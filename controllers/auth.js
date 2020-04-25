const User = require('../models/user');

exports.getLogin = (req, res) => {
    // console.log(req.get('Cookie'))
    // const isLoggedIn = req.get('Cookie').split(';')[0].trim().split('=')[1];
    res.render('auth/login', {
        path: '/login',
        isAuthenticated: false,
        pageTitle: 'login',
    });
};
exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({email});
        const isMatched = await user.comparePasswords(password, user.password);

        if (isMatched) {
            req.session.isLoggedIn=true
            req.session.user = user
            res.redirect('/');
        } else {
            req.session.isLoggedIn=false
            req.session.user = null
        }
    } catch (e) {
        console.log(e)
    }
};


exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};


exports.getSignup = async (req, res) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false,
    });
};

exports.postSignup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        await User.create({ name, email, password});

        next()
    } catch (e) {
        console.log(e)
    }
};

exports.protectRoutes = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login')
    }

    next()
}