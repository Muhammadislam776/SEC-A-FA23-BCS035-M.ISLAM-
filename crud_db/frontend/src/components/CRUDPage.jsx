import React, { useEffect, useState } from "react";
import axios from "axios";

function CRUDPage({ dbType, goBack }) {

  const [items, setItems] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: ""
  });

  const [editingId, setEditingId] = useState(null);


  // Fetch Items
  const fetchItems = async () => {

    try {

      const res = await axios.get(
        `http://localhost:5000/api/items?db=${dbType}`
      );

      setItems(res.data);

    } catch (err) {

      console.log(err);

    }

  };


  useEffect(() => {

    fetchItems();

  }, [dbType]);



  // Handle Input Change
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };



  // Add or Update Item
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (editingId) {

        await axios.put(
          `http://localhost:5000/api/items/${editingId}?db=${dbType}`,
          form
        );

        setEditingId(null);

      } else {

        await axios.post(
          `http://localhost:5000/api/items?db=${dbType}`,
          form
        );

      }

      setForm({
        name: "",
        description: "",
        price: ""
      });

      fetchItems();

    } catch (err) {

      console.log(err);

    }

  };



  // Delete Item
  const deleteItem = async (id) => {

    try {

      await axios.delete(
        `http://localhost:5000/api/items/${id}?db=${dbType}`
      );

      fetchItems();

    } catch (err) {

      console.log(err);

    }

  };



  // Edit Item
  const editItem = (item) => {

    setForm({
      name: item.name,
      description: item.description,
      price: item.price
    });

    setEditingId(item.id || item._id);

  };



  return (

    <div className="crud-container">

      {/* Back Button */}

      <button
        className="back-btn"
        onClick={goBack}
      >
        ⬅ Back to Home
      </button>



      <h1 className="page-title">

        {dbType.toUpperCase()} CRUD Dashboard

      </h1>



      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="item-form"
      >

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />

        <button type="submit">

          {editingId ? "Update Item" : "Add Item"}

        </button>

      </form>



      {/* Item List */}

      <div className="items-grid">

        {items.map((item) => (

          <div
            key={item.id || item._id}
            className="item-card"
          >

            <h3>{item.name}</h3>

            <p>{item.description}</p>

            <p className="price">

              ${item.price}

            </p>

            <div className="item-actions">

              <button
                className="edit-btn"
                onClick={() => editItem(item)}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() =>
                  deleteItem(item.id || item._id)
                }
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}

export default CRUDPage;