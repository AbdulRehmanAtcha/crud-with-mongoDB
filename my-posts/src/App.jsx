// import logo from './logo.svg';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

let baseUrl = ``;
if (window.location.href.split(":")[0] === "http") {
  baseUrl = `http://localhost:5001`
}

function App() {
  const [products, setProducts] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  // const [showEdit, setShowEdit] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const addObj = {
    name: name,
    price: price,
    description: description
  }


  const showAddBox = (e) => {
    e.preventDefault();
    setShowAdd(true);
  }


  const hideAddBox = (e) => {
    e.preventDefault();
    setShowAdd(false);
    console.log(name);
    console.log(price);
    console.log(description);
    axios.post(`${baseUrl}/product`, addObj)
      .then(response => {
        console.log("response: ", response.data);
        allPosts();

      })
      .catch(err => {
        console.log("error: ", err);
      })
  }



  const allPosts = async () => {
    try {
      const response = await axios.get(`${baseUrl}/products`)
      console.log("Got All Products", response.data.data);
      setProducts(response.data.data);
    }

    catch (error) {
      console.log("Error", error);
    }

  }


  useEffect(() => {
    allPosts();
  }, [])

  const deletProduct = async (id) => {
    try {
      const response = await axios.delete(`${baseUrl}/product/${id}`)
      console.log("Got All Products", response.data.data);
      allPosts();
    }

    catch (error) {
      console.log("Error", error);
    }
  }

  const editHandler = async(e)=>{
    setShowEdit(true);
  }


  const updateHandler = (event)=>{
    event.preventDefault();
    setShowEdit(false);
    let newName = editName;
    let newPrice = editPrice;
    let newDesc = editDesc;
    axios.put(`${baseUrl}/product/${editId}`,{
      name: newName,
      price: newPrice,
      description: newDesc,
    })
    .then((response) => {
      console.log(response);
      allPosts();
     
    }, (error) => {
      console.log(error);
    });
  }
  const editNameHandler = (e)=>{
    setEditName(e.target.value);
  }

  const editPriceHandler = (e)=>{
    setEditPrice(e.target.value);
  }
  const editDescHandler = (e)=>{
    setEditDesc(e.target.value);
  }


  return (
    <>
      <body>
        <div className="nav">
          <h2>Manage Products</h2>
          <div className="add-button">
            <form onSubmit={showAddBox}>
              <button type="submit button" className="btn btn-success">Add Product</button>
            </form>
          </div>
        </div>
        <div className="add-form">
          <div className={showAdd ? "box show-add" : "box hide-add"}>
            <form onSubmit={hideAddBox}>
              <input type="text" placeholder='Name Of Product.' required minLength="3" onChange={(e) => {
                setName(e.target.value)
              }} />
              <input type="number" placeholder='Enter Product Price' required onChange={(e) => {
                setPrice(e.target.value);
              }} />
              <textarea cols="50" rows="8" placeholder='Enter Product Description.' required minLength="3" maxLength="100" onChange={(e) => {
                setDescription(e.target.value);
              }} ></textarea>
              <button type='submit'>ADD</button>
            </form>
          </div>
          <div className={showEdit ? "edit show": "edit hide"}>
            <form onSubmit={updateHandler}>
              <input type="text" onChange={editNameHandler} placeholder="New Name"/>
              
              <input type="number" placeholder="New Price" onChange={editPriceHandler}/>

              <textarea cols="50" rows="8" onChange={editDescHandler}></textarea>
              <button type='submit'>Update</button>
            </form>
          </div>
        </div>

        <table className="table table-dark table-striped">
          <thead>
            <tr>
              <th scope="col">Product ID</th>
              <th scope="col">Product Name</th>
              <th scope="col">Product Price</th>
              <th scope="col">Product Description</th>
              <th scope="col">Edit Choice</th>
              <th scope="col">Delete Choice</th>
            </tr>
          </thead>
          <tbody>
            {products.map((eachProduct, i) => (
              <tr key={i}>
                <th scope="row">{eachProduct._id}</th>
                <td>{eachProduct.name}</td>
                <td>{eachProduct.price}</td>
                <td>{eachProduct.description}</td>
                <td><button className="btn btn-primary" onClick={() => {
                  editHandler(
                    setEditId(eachProduct._id)
                  )

                }}>Edit</button></td>
                <td><button className="btn btn-danger" onClick={() => {
                  deletProduct(eachProduct._id)
                }}>DELETE</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </body>
    </>
  );
}

export default App;
