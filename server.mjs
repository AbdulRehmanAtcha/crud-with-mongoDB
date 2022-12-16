import express from 'express';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express()
const port = process.env.PORT || 5001;
const MongoDBURI = process.env.MongoDBURI || "mongodb+srv://dbuser:dbpassword@cluster0.zcczzqa.mongodb.net/?retryWrites=true&w=majority";   

app.use(cors());
app.use(express.json());

let productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: {type: Number, required: true },
    description: {type: String, required: true},
    createdOn: { type: Date, default: Date.now }
});
const productModel = mongoose.model('products', productSchema); 

let products = [];

app.post('/product', (req,res)=>{
    const body = req.body;

    if(!body.name || !body.price || !body.description){
        res.status(404);
        res.send({
            message: "All Inputs Are Required"
        });
        return;
    }
    // products.push(
    //     {
    //         id: new Date().getTime(), 
    //         name: body.name,
    //         price: body.price,
    //         description: body.description

    //     }
    // )

    productModel.create({
        name: body.name,
        price: body.price,
        description: body.description,
    },
        (err, saved) => {
            if (!err) {
                console.log(saved);

                res.send({
                    message: "your product is saved"
                })
            } else {
                res.status(500).send({
                    message: "server error"
                })
            }       
        })

    // res.send({
    //     message: "Product Added Successfully!",
    //     data: products
    // });
})
app.get('/products', (req, res) => {

    productModel.find({}, (err, data) => {
        if (!err) {
            res.send({
                message: "got all products successfully",
                data: data
            })
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });
})

app.get('/product/:id', (req, res)=>{
    let isProductFound = false;
    const id = req.params.id;
    for(let i = 0; i<products.length; i++){
        if(products[i].id == id){
            res.send({
                message: `Product Found ${products[i]}`,
                data: products[i]
            });
            isProductFound = true;
            break;
        }
    }
    if(isProductFound === false){
        res.status(404);
        res.send({
            message: "Could't Find This Product"
        });
    }
})

app.delete('/product/:id', (req, res)=>{
    let isProductFound = false;
    const id = req.params.id;
    for(let i = 0; i<products.length; i++){
        if(products[i].id == id){
            products.splice(i, 1);
            res.send({
                message: "Product Deleted Successfully!"
            });
            isProductFound = true
        }
    }
    if(isProductFound === false){
        res.status(404);
        res.send({
            message:"Could't Find This Product"
        });
    }
})

app.put('/products/:id', (req,res)=>{
    const id = req.params.id

    if(!body.name || !body.price || !body.description){
        res.status(404);
        res.send({
            message: "All Inputs Are Required"
        });
        return;
    }

    let isProductFound = false;
    for(let i = 0; i<products.length; i++){
        if(products[i].id == id){
            products[i].name = body.name;
            products[i].price = body.name;
            products[i].description = body.description;
            res.send({
                message: "Product Edited!"
            });
            isProductFound = true;
            break;
        }
    }
    if(isProductFound === false){
        res.status(404);
        res.send({
            message: "Could't Find This Product"
        });
    }
    
})


const __dirname = path.resolve();

app.use('/', express.static(path.join(__dirname, './my-posts/build')))
app.use('*', express.static(path.join(__dirname, './my-posts/build')))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



/////////////////////////////////////////////////////////////////////////////////////////////////
mongoose.connect(MongoDBURI);


////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////