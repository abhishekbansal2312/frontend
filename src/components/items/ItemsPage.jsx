import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import Form from "./Form";
import SearchBar from "./SearchBar";
import ItemsList from "./ItemsList";

export default function ItemsPage() {
  const [formFields, setFormFields] = useState({
    name: "",
    amount: "",
    description: "",
    quantity: 1,
    category: "Electronics",
    isActive: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editIndex, setEditIndex] = useState(-1);

  const getAllItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:4100/api/items", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setItems(data.items);
      setFilteredItems(data.items);
    } catch (error) {
      console.error("Error fetching items:", error);
      setError("Failed to fetch items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllItems();
  }, []);

  const handleFormSubmit = async (e, id) => {
    e.preventDefault();
    const url =
      editIndex === -1
        ? `http://localhost:4100/api/items`
        : `http://localhost:4100/api/items/${id}`;
    const method = editIndex === -1 ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formFields),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setShowModal(false);
      setEditIndex(-1);
      getAllItems();
    } catch (error) {
      console.error("Error adding/updating item:", error);
    }
  };

  const handleEdit = (index, item) => {
    setEditIndex(index);
    setFormFields({
      name: item.name || "",
      amount: item.amount || 0,
      description: item.description || "",
      quantity: item.quantity || 1,
      category: item.category || "default",
      isActive: item.isActive ?? true,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:4100/api/items/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      setItems((prevItems) => prevItems.filter((item) => item._id !== id));
      setFilteredItems((prevFiltered) =>
        prevFiltered.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredItems(filtered);
  };

  return (
    <div>
      <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              setShowModal(true);
              setFormFields({
                name: "",
                amount: 0,
                description: "",
                quantity: 1,
                category: "Electronics",
                isActive: false,
              });

              setEditIndex(-1);
            }}
            className="bg-indigo-600 text-sm text-white px-3 py-2 rounded-lg shadow-md hover:bg-indigo-700"
          >
            Add Item
          </button>
          <SearchBar onSearch={handleSearch} />
        </div>

        {showModal && (
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title={editIndex === -1 ? "Add Item" : "Edit Item"}
          >
            <Form
              formFields={formFields}
              setFormFields={setFormFields}
              handleSubmit={(e) =>
                handleFormSubmit(
                  e,
                  editIndex >= 0 ? items[editIndex]._id : null
                )
              }
              onCancel={() => setShowModal(false)}
            />
          </Modal>
        )}

        <div className="mt-4">
          {loading ? (
            <p className="text-center text-gray-500">Loading items...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <ItemsList
              items={filteredItems}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
