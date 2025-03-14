import { useState } from 'react';
import './App.css'
import supabase from './supabase-client';
import { useEffect } from 'react';

function App() {
  const [todoList, setTodoList] = useState([])
  const [newTodo, setNewTodo] = useState("")

  useEffect(() => {
    fetchToDos()
  }, []);

  const fetchToDos = async () => {
    const { data, error } = await supabase.from("TodoList").select("*"); // * in SQL means all
    if (error) {
      console.log(error, "some error occured fetching");
    } else {
      setTodoList(data);
    }
  }

  const addTodo = async () => {
    const newTodoData = {
      name: newTodo,
      isCompleted: false,
    };
    const { data, error } = await supabase.from("TodoList").insert([newTodoData]).single();
      if (error) {
        console.log(error, "Error processing the command.");
      } else {
        setTodoList((prev) => [...prev, data]);
        setNewTodo("");
      }
  };

  const completeTask = async (id, isCompleted) => {
    const {data, error} = await supabase.from("TodoList").update({isCompleted: !isCompleted}).eq("id", id);
      if (error) {
        console.log(error, "some error has occurred");
      } else {
        const updatedTodoList = todoList.map((todo) => todo.id === id ? {...todo, isCompleted: !isCompleted} : todo);
        setTodoList(updatedTodoList);
    }
  };

  return (
    <div>
      {" "}
      <h1>Todo List</h1>
      <div>
        <input type='text' placeholder='New Todo...' value={newTodo} onChange={(e) => setNewTodo(e.target.value)}/>
        <button onClick={addTodo}>Add Todo Item</button>
      </div>

      <ul>
        {todoList.map((todo) => (
          <li>
            <p> {todo.name} </p>
            <button onClick={() => completeTask(todo.id, todo.isCompleted)}> {todo.isCompleted ? "Undo" : "Complete Task"}</button>
            <button> Delete Task </button>
          </li>
        ))}
      </ul>
    </div>
    );
}

export default App;
