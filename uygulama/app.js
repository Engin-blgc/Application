const express = require('express');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('database.db');
const hbs = require('hbs');
const joi = require('@hapi/joi');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'hbs')
app.set('views', 'users')

app.get('/', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      res.status(500).send('İstek gerçekleştirilirken hata oluştu');
    }else{
      res.render('index',{rows});
    } 
  }); 
});

app.get('/user/create', (req, res) => {
    res.render('create');
});

app.get('/user/detail/update/:id', (req, res) => {
    const selectId = parseInt(req.params.id);
    db.get('SELECT * FROM users WHERE id = ?', [selectId], (err, row) => {
    if(err){
      res.status(500).send('İstek gerçekleştirilirken hata oluştu');
    }else{
      res.render('update',{row});
         }
});
});

app.get('/user/detail/:id', (req, res) => {
    const selectId = parseInt(req.params.id);
    db.get('SELECT * FROM users WHERE id = ?', [selectId], (err, row) => {
    if(err){
      res.status(500).send('İstek gerçekleştirilirken hata oluştu');
    }else{
      res.render('detail',{row});
         }   
});
});

app.post('/user/create', (req, res) => {
    const joiSchema = joi.object({
    name:joi.string().min(3).max(25).required(),
    age:joi.number().integer().min(5).max(99).required()
    });

    const outcome = joiSchema.validate(req.body);
    const name = req.body.name;
    const age = req.body.age;  
    
    if(outcome.error){
      res.status(400).send('Girilen veriler hatali veya eksik.');
    }else{
          db.run(`INSERT INTO users (name, age) VALUES (?, ?)`, [name, age], (err) => {
            if (err) {
                console.error(err.message);
            }     
          });
          res.redirect('/');
         }   
});

app.post('/user/detail/update/:id',(req,res)=>{ 

    const joiSchema = joi.object({
    name:joi.string().min(3).max(25).required(),
    age:joi.number().integer().min(5).max(99).required()
    });

    const outcome = joiSchema.validate(req.body);  
    const selectId = parseInt(req.params.id);
    const name = req.body.name;
    const age  = req.body.age;

    if(outcome.error){
      res.status(400).send('Girilen veriler hatali veya eksik.');
    }else{
      db.run('UPDATE users SET name = ?, age = ? WHERE id = ?', [name, age, selectId], (err)=> {
          if (err) {
            console.error(err.message);
          }
            });
            res.redirect('/'); 
         }                      
});

app.post('/user/detail/:id',(req, res)=>{
  const selectId = parseInt(req.params.id);
  db.get('DELETE FROM users WHERE id = ?', [selectId], (err) => {
  if (err) {
    res.status(500).send("Silme işlemi gerçekleştirilemedi.");
  }else {
    res.redirect('/');
  }
});   
});

app.listen(4000, () => {
    console.log("4000 portunu dinliyorum.");
});