import React from "react";

const ItemCard = ({ item, onDelete, onEdit }) => {

  return (
    <div className="bg-white shadow-lg rounded-lg p-4">

      <h2 className="text-xl font-bold">{item.name}</h2>

      <p className="text-gray-600">{item.description}</p>

      <p className="text-green-600 font-semibold">${item.price}</p>

      <div className="flex gap-3 mt-4">

        <button
          onClick={() => onEdit(item)}
          className="bg-yellow-500 text-white px-3 py-1 rounded"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(item.id || item._id)}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Delete
        </button>

      </div>

    </div>
  );

};

export default ItemCard;