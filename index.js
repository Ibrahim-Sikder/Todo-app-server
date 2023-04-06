const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors=require('cors');
const port = process.env.PORT || 5000;



app.use(cors());
app.use(express.json())


app.get('/', (req, res)=>{
    res.send('Simple node server running!')
})

// database connect 
// password: XOO7jlpTIbFpq5DU
// name : simple


const uri = "mongodb+srv://todo-users:jxe29KzLdNu31hAt@cluster0.fomplst.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run(){
    try{
        const userCollection = client.db('TodoApp').collection('users')
        app.get('/users', async (req, res)=>{
            const query = {}
            const cursor = userCollection.find(query)
            const users = await cursor.toArray();
            res.send(users)
        })

        app.put('/users/:id', async(req, res)=>{{
            const id = req.params.id;
            const filter = { _id: new ObjectId(id)};
            const user = req.body;
            const option = {upsert: true};
            const updatedUser = {
                $set:{
                    name: user.title,
                    email: user.description
                }
                

            }
            const result = await userCollection.updateOne(filter, updatedUser, option);
            res.send(result)

        }})
        app.get('/users/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const user = await userCollection.findOne(query);
            res.send(user);
        })


         app.post('/users', async (req, res)=>{
            const user = req.body ;
            console.log(user);
            const result = await userCollection.insertOne(user)
            res.send(result)
       })
       app.delete('/users/:id', async (req, res)=>{
        const id = req.params.id;
        // console.log('Trying to delete', id);
        const query = {_id: new ObjectId(id)};
        const result = await userCollection.deleteOne(query)
        console.log(result)
        res.send(result)
       })

       
        }
      
    finally{

    }
}
run().catch(err => console.log(err))


app.listen(port, ()=>{[
    console.log(`Todo-list running! ${port}`)
]})