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
  const [showEdit, setShowEdit] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  // const [productEditName, setProductEditName] = useState("");
  // const [productEditPrice, setProductEditPrice] = useState("");
  // const [productEditDescription, setProductEditDescription] = useState("");
  const [editId, setEditId] = useState(null)

  const addObj = {
    name: name,
    price: price,
    description: description
  }


  const showAddBox = (e) => {
    e.preventDefault();
    setShowAdd(true);
  }

  const showEditBox = async (names, price, desc) => {
    // e.preventDefault();
    setShowEdit(true);
  }

  const hideAddBox = (e) => {
    e.preventDefault();
    setShowAdd(false);
    console.log(name);
    console.log(price);
    console.log(description);
    axios.post(`${baseUrl}/product`, addObj)
      .then(function (response) {
        // handle success
        console.log(response.data.data);
        allPosts();
      })
      .catch(function (error) {
        // handle error
        console.log("Error", error);
      })
  }

  const hideEditBox = (e) => {
    e.preventDefault();
    setShowEdit(false); 

    axios.put(`${baseUrl}/product/${editId}`, {
      name: name,
      price: price,
      description: description

    })
      .then((response) => {
        console.log(response);
        allPosts();

      }, (error) => {
        console.log(error);
      });
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


  return (
    <>
      <body>
        <div className="nav">
          <h2>Manage Products</h2>
          <div className="find">
            <form>
              <input type="text" placeholder='Search Product.' />
              <button className="btn btn-success">Search</button>
            </form>
          </div>
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
          <div className={showEdit ? "box show-edit" : "box hide-edit"}>
            <form onSubmit={hideEditBox}>
              <input type="text" placeholder='Name Of Product.' required minLength="3" onChange={(e) => {
                setName(e.target.value)
              }} />
              <input type="number" placeholder='Enter Product Price' required onChange={(e) => {
                setPrice(e.target.value);
              }} />
              <textarea cols="50" rows="8" placeholder='Enter Product Description.' required minLength="3" maxLength="100" onChange={(e) => {
                setDescription(e.target.value);
              }} ></textarea>
              <button type='submit' onClick={hideEditBox}>UPDATE</button>
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
                <th scope="row">{eachProduct.id}</th>
                <td>{eachProduct.name}</td>
                <td>{eachProduct.price}</td>
                <td>{eachProduct.description}</td>
                <td><button className="btn btn-warning" onClick={() => {
                  showEditBox(
                    eachProduct
                  )
                }}>EDIT</button></td>
                <td><button className="btn btn-danger" onClick={() => {
                  deletProduct(eachProduct.id)
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
