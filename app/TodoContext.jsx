import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create the TodoContext
const TodoContext = createContext();

// TodoProvider to wrap the app and provide the todos context
export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([
    {
      id: "0",
      description: "Sample Todo",
      date: "01/01/2025",
      completed: true,
      starred: false,
    },
    {
      id: "3",
      description: "Complete React project",
      date: "14/03/2025",
      completed: false,
      starred: false,
    },
    {
      id: "4",
      description: "Call the doctor for an appointment",
      date: "16/03/2025",
      completed: false,
      starred: true,
    },
    {
      id: "5",
      description: "Finish reading the book",
      date: "18/03/2025",
      completed: false,
      starred: true,
    },
    {
      id: "6",
      description: "Clean the house",
      date: "19/03/2025",
      completed: false,
      starred: false,
    },
    {
      id: "7",
      description: "Prepare presentation for work",
      date: "20/03/2025",
      completed: false,
      starred: false,
    },
  ]);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const storedTodos = await AsyncStorage.getItem("todos");
        if (storedTodos) {
          setTodos(JSON.parse(storedTodos)); // Parse the stored todos if they exist
        }
      } catch (error) {
        console.error("Error loading todos from AsyncStorage:", error);
      }
    };

    loadTodos();
  }, []);

  // Save todos to AsyncStorage whenever they change
  useEffect(() => {
    const saveTodos = async () => {
      try {
        await AsyncStorage.setItem("todos", JSON.stringify(todos));
      } catch (error) {
        console.error("Error saving todos to AsyncStorage:", error);
      }
    };

    if (todos.length > 0) {
      saveTodos();
    }
  }, [todos]);

  //   const addTodo = (todo) => {
  //     setTodos([...todos, todo]);
  //   };

  //   const deleteTodo = (id) => {
  //     setTodos(todos.filter((todo) => todo.id !== id));
  //   };

  //   const updateTodo = (updatedTodo) => {
  //     setTodos(
  //       todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
  //     );
  //   };

  return (
    <TodoContext.Provider value={{ todos, setTodos }}>
      {children}
    </TodoContext.Provider>
  );
};

// Custom hook to use the Todo context
export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodos must be used within a TodoProvider");
  }
  return context;
};
