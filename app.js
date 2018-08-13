const express = require('express');
const app = express();
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
app.set('view engine' , 'html');
app.engine('html' , require('ejs').renderFile);
app.set('views' , './views');
app.use('/public' , express.static('static'));

app.get('/' , (req , res) => {
    res.render('./index.html');
});
app.get('/backtop' , (req , res) => {
    res.render('./backtop.html');
});
app.get('/slider' , (req , res) => {
    res.render('./slider.html');
});
app.get('/carousel' , (req , res) => {
    res.render('./carousel.html');
});
app.get('/select' , (req , res) => {
    res.render('./select.html');
});
app.get('/fullpage' , (req , res) => {
    res.render('./fullpage.html');
});
app.get('/lazyload' , (req , res) => {
    res.render('./lazyload.html');
});
app.get('/datepicker' , (req , res) => {
    res.render('./datepicker.html');
});
app.get('/upload' , (req , res) => {
    res.render('./upload.html');
});
app.get('/dialog' , (req , res) => {
    res.render('./dialog.html');
});
app.post('/upload' , (req , res) => {
    var form = new formidable.IncomingForm();
    // 临时存放图片文件目录
    form.uploadDir = path.resolve(__dirname , 'tmp');
    form.parse(req, function(err, fields, file) {
        let filePath = '';
        var types = ['image/jpg' , 'image/jpeg' , 'image/png'];
        if (file.upload) {
            filePath = file.upload.path;
        };
        let targetDir = path.resolve(__dirname , 'upload');
        try {
            fs.readdirSync(targetDir);
        } catch (err) {
            fs.mkdirSync(targetDir);
        };
        if (types.indexOf(file.upload.type) > -1) {
            let targetFile = path.resolve(targetDir , file.upload.name);
            fs.rename(filePath , targetFile , function (err) {
                if (err) {
                    console.log(err);
                    res.json({
                        code : -2,
                        message : '图片保存失败'
                    })
                } else {
                    res.json({
                        code : 0 , 
                        fileUrl : targetFile
                    });
                }
            })
        } else {
            console.log('上传的文件不是图片');
            res.json({
                code : -1,
                message : '上传的不是图片'
            })
        }
    });
});
app.listen('3000' , () => {
    console.log('listening port on 3000');
});