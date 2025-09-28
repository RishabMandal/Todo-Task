import { Text, View } from "react-native";
import "../global.css";
import Todo from "../components/todo";
import TodoDetailedView from "./[id]";
import Todolist from "./Todolist";
// import addTodo from "../components/addTodo";
import { useState } from "react";
import { useTodos } from "./TodoContext";
import { StatusBar } from "expo-status-bar";
// import * as NavigationBar from 'expo-navigation-bar';

export default function Index() {
  const { todos, setTodos } = useTodos();
  // const visibility = await NavigationBar.getVisibilityAsync("hidden");

  return (
    <View
      className="bg-black text-white min-h-screen"
    >
      <StatusBar style="dark" hidden />
      <Todolist todos={todos} setTodos={setTodos} />
    </View>
  );
}
