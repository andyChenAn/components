const express = require('express');
const app = express();

app.set('view engine' , 'html');
app.engine('html' , require('ejs').renderFile);
app.set('views' , './views');
app.use('/public' , express.static('static'));

app.get('/' , (req , res) => {
    res.render('./index.html');
});
app.get('/backTop' , (req , res) => {
    res.render('./backTop.html');
});
app.get('/slider' , (req , res) => {
    res.render('./slider.html');
});
app.get('/carousel' , (req , res) => {
    res.render('./carousel.html');
});
app.get('/select' , (req , res) => {
    res.render('./select.html');
})
app.listen('3000' , () => {
    console.log('listening port on 3000');
});