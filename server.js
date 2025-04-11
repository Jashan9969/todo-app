const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const Task = require('./models/Task');

const app =  express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/todo-db',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=> console.log('MongoDB connected'))
.catch(err => console.error('MongoDb error',err));


app.get('/tasks', async(req,res)=>{
    const tasks = await Task.find();
    res.json(tasks);
})

app.post('/tasks', async (req, res) => {
    const { title } = req.body;
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }
    const newTask = new Task({ title });
    await newTask.save();
    res.status(201).json(newTask);
  });


 
app.put('/tasks/:id', async (req, res) => {
    const { title, completed } = req.body;
    try {
      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        { title, completed },
        { new: true, runValidators: true }
      );
      if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
      res.json(updatedTask);
    } catch (err) {
      res.status(400).json({ error: 'Invalid update' });
    }
  });



  app.delete('/tasks/:id', async (req, res) => {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  });
  

  app.listen(PORT, () => 
    console.log(`Server running on http://localhost:${PORT}`));