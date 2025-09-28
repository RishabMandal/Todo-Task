import { View, Text, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import "../global.css";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";

const Todo = ({ todos, setTodos, todo }) => {
  const handleDelete = (id) => {
    Alert.alert(
      "Confirm Deletion", // Title of the alert
      "Are you sure you want to delete this todo?", // Message in the alert
      [
        {
          text: "Cancel", // Button for canceling the action
          style: "cancel", // Make it cancel style
        },
        {
          text: "OK", // Button for confirming the deletion
          onPress: () => {
            // Proceed to delete the todo
            const updatedTodos = todos.filter((todo) => todo.id !== id);
            setTodos(updatedTodos);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const [completed, setCompleted] = useState(todo?.completed);
  const handleSave = () => {
    const updatedTodo = { ...todo, completed }; // Update the todo with new description
    setTodos(
      todos.map((item) => (item.id === updatedTodo.id ? updatedTodo : item))
    );
  };
  useEffect(() => {
    handleSave();
  }, [completed]);

  return (
    <View className="text-white borde border-white p-3 w-full bg-[#171717] rounded-xl my-2">
      <View className="flex flex-row justify-between gap-3">
        <View className="text-red-600 flex-1">
          <Text className="text-white text-xl w-full font-semibold">
            {todo?.description}
          </Text>
          <Text className="text-white">{todo?.date}</Text>
        </View>
        <View className="flex flex-row items-center gap-3">
          {/* <Feather name="edit" size={24} color="blue" /> */}
          {!todo?.completed ? (
            <MaterialIcons
              name="done-outline"
              size={24}
              color="green"
              onPress={() => {
                setCompleted(true);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                setTimeout(() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }, 200);
              }}
            />
          ) : (
            <MaterialIcons
              name="remove-done"
              size={24}
              color="green"
              onPress={() => {
                setCompleted(false);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                setTimeout(() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }, 200);
              }}
            />
          )}
          <AntDesign
            name="delete"
            size={24}
            color="red"
            className="stroke-red-600"
            onPress={() => {
              handleDelete(todo?.id);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              setTimeout(() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }, 200);
            }}
          />
          {/* <Text
            className="text-red-600"
            onPress={() => {
              handleDelete(todo?.id);
            }}
          >
            Delete
          </Text> */}
        </View>
      </View>
    </View>
  );
};

export default Todo;
