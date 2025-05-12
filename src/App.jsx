import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import React, { useState, useEffect } from "react";
import { createTodo, deleteToDo, scanTodos, toggleCompleted } from "./dynamo";

export default function App() {
  const [input, setInput] = useState();
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const client = new DynamoDBClient({
    region: import.meta.env.VITE_AWS_REGION,
  });
  useEffect(() => {
    scanTodos().then(setTodos);
  }, []);

  async function handleDelete(id) {
    await deleteToDo(id);
    setTodos((prev) => prev.filter((item) => item.id != id));
  }

  async function handleToggle(todo) {
    const flipped = !todo.completed;
    toggleCompleted(todo.id, flipped);
    setTodos((prev) =>
      prev.map((item) =>
        item.id === todo.id ? { ...item, completed: flipped } : item
      )
    );
  }

  const handleAdd = async () => {
    if (!text.trim()) return;
    const newItem = { id: Date.now().toString(), text, completed: false };
    await createTodo(newItem);
    setTodos((prev) => [...prev, newItem]);
    setText("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Todo App</h1>
      <label htmlFor="">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="New todo"
          style={{ marginRight: 8 }}
        />
      </label>
      <button onClick={handleAdd}>Add</button>

      <ul style={{ marginTop: 16 }}>
        {todos.map((t) => (
          <div key={t.id}>
            <input
              onChange={() => handleToggle(t)}
              checked={t.completed}
              type="checkbox"
              name="done"
              id="done"
            />
            <li
              style={{ textDecoration: t.completed ? "line-through" : "none" }}
            >
              {t.text}
            </li>
            <button onClick={() => handleDelete(t.id)}>Remove</button>
          </div>
        ))}
      </ul>
    </div>
  );
}
