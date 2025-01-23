const express=require("express")//imported express
const app=express()//instance of express
app.use(express.json())//parse json data
const mongoose=require("mongoose")
const { v4: uuidv4 } = require('uuid');
const PORT=8000

const mongourl="mongodb+srv://midhun:midhun123@chat-app.oeisj.mongodb.net/Expense-tracker"
mongoose
  .connect(mongourl)
  .then(()=>{
    console.log("Db connected")
    app.listen(PORT,()=>{
      console.log("My server is running")
    })
  })


const expenseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
});

const expenseModel = mongoose.model("expense-tracker", expenseSchema);//cln name, schema name


app.get('/api/expenses',async(req,res)=>{
  const data = await expenseModel.find({});
  res.json(data)

})

app.get('/api/expensesById/:id',async(req,res)=>{
  const {id}=req.params;
  const getid=await expenseModel.findOne({id});
  res.json(getid);
})


app.post("/api/expenses", async (req, res) => {
  const { title, amount } = req.body;
  const newExpense = new expenseModel({
    id: uuidv4(),
    title: title,
    amount: amount,
  });
  const savedExpense = await newExpense.save(); 
  res.status(200).json(savedExpense);
});

app.put("/api/expenses/:id",async(req,res)=>{
  const {id} = req.params;
  const{title,amount} = req.body;
  const updatedExpense = await expenseModel.findOneAndUpdate(
    {
      id:id,
    },
    {
      title:title,
      amount:amount,
    }
  )
  res.status(200).json(updatedExpense);
})

 