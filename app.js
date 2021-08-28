const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const app = express();
const PORT = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serving public file
app.use(express.static(__dirname));

app.use(cookieParser());

const myusername = 'user1'
const mypassword = 'teste'
const myusername2 = 'user2'
const mypassword2 = 'teste'

var session;

const oneDay = 1000 * 30;// * 60 * 24;
app.use(sessions({
    secret: "exsenha",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));
app.get('/',(req,res) => {
    session=req.session;
    console.log(session.userid);
    if(session.userid){
        res.send("Bem vindo! A tela de login não será mostrada pois sua sessão ainda não expirou! <a href=\'/logout'>Logoff</a>");
    }else
    res.sendFile('views/index.html',{root:__dirname})
});

app.post('/user',(req,res) => {
    if((req.body.username == myusername && req.body.password == mypassword)||req.body.username == myusername2 && req.body.password == mypassword2){
        session=req.session;
        session.userid=req.body.username;
        console.log(req.session)
        res.send(`Bem vindo, você está logado! <br> <a href=\'/logout'>Logoff</a> <br> <a href=\'/'>Voltar a tela de login</a>`);
    }
    else{
        res.send('Usuário ou senha inválidos');
    }
})

app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(PORT, () => console.log(`Servidor rodando, porta: ${PORT}`));