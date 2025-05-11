import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import React, { useState, useEffect } from "react";
import { createTodo, scanTodos } from "./dynamo";

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
          <li key={t.id}>{t.text}</li>
        ))}
      </ul>
    </div>
  );
}
