//use express.js
const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

//connect db
mongoose.connect("mongodb://localhost/user");
const db = mongoose.connection;
db.on('error', err => console.log(err));
db.once('open', () => console.log('connected to database'));
app.use(express.json());

//set the model
const Schema = mongoose.Schema;
const todoSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});
const Todo = mongoose.model('Todo', todoSchema);

//CRUD api
//1."POST /todos"
app.post('/todos',async (req, res) => {
    try{
        const { content } = req.body;
        const newTodo = new Todo({content});
        const saveTodo = await newTodo.save();
        res.status(201).json(saveTodo);
    }catch(error){
        res.status(500).json({error: error.message});
    }
});

//2."GET /todos "
app.get('/todos', async (req, res) => {
    try{
        const todos = await Todo.find();
        res.status(200).json(todos);
    }catch(error){
        res.status(500).json({error: error.message});
    }
});

//3. "GET /todos/:id"
app.get('/todos/:id', async (req, res) => {
    try{
        const todo = await Todo.findById(req.params.id);
        if(!todo){
            return res.status(404).json({message: 'Todo not found'});
        }
        res.status(200).json(todo);
    }catch(error){
        res.status(500).json({error: error.message});
    }
});

//4. "PUT /todos/:id"
app.put('/todos/:id', async (req, res) => {
    try{
        const {content} = req.body;
        const updateTodo = await Todo.findByIdAndUpdate(req.params.id, {content}, {new: true});
        if(!updateTodo) {
            return res.status(404).json({message: 'Todo not found'});
        }
    }catch(erroe){
        res.status(500).json({error: error.message});
    }
});

//5. "DELETE /todos/:id"
app.delete('/todos/:id', async (req, res) => {
    try{
        const deleteTodo = await Todo.findByIdAndDelete(req.params.id);
        if(!deleteTodo){
            return res.status(404).json({message: 'Todo not found'});
        }
        res.status(200).json({message: 'Todo deleted successfully'});
    }catch(error){
        res.status(500).json({error: error.message});
    }
});

app.listen(3000, ()=>console.log("server started"));