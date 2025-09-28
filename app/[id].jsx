import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Switch,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTodos } from "./TodoContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";
import { Alert } from "react-native";

const TodoDetailedView = () => {
  const { id } = useLocalSearchParams(); // Get the 'id' from the URL params
  const { todos, setTodos } = useTodos(); // Access the todos from context

  // Find the todo by its id
  const todo = todos.find((todo) => todo.id === id || todo.id === parseInt(id));

  // State to manage the edited description
  const [description, setDescription] = useState(todo?.description || "");
  const [date, setDate] = useState(todo?.date || "");
  const [starred, setStarred] = useState(todo?.starred || "");

  // Handler to save the updated todo description
  const handleSave = () => {
    if (description.trim()) {
      const updatedTodo = { id: todo?.id, description, date, starred }; // Update the todo with new description
      setTodos(
        todos.map((item) => (item.id === updatedTodo.id ? updatedTodo : item))
      ); // Update the todos in the context
    }
  };

  const router = useRouter();
  return (
    <View
      className="bg-black min-h-[100vh] p-4 pt-10"
      style={{ color: "white" }}
    >
      <View className="flex flex-row justify-between pb-3 items-center">
        <Ionicons
          name="arrow-back-circle-outline"
          size={36}
          color="white"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push("/");
          }}
        />
        <Text className="text-white text-2xl font-semibold">Edit task</Text>
        <Ionicons name="mic-circle-outline" size={36} color="white" />
      </View>
      {todo ? (
        <>
          <Text className="text-white">Description</Text>
          <TouchableOpacity
            onLongPress={() => {
              Clipboard.setStringAsync(todo.description);
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );
              Alert.alert("Copied to clipboard", `"${todo.description}"`);
            }}
          >
            <Text style={{ color: "white", fontSize: 24, marginBottom: 10 }}>
              {todo.description}
            </Text>
          </TouchableOpacity>
          <Text className="text-white">Date</Text>
          <Text style={{ color: "white", fontSize: 18 }}>{todo.date}</Text>
          {/* Editable TextInput for the description */}
          <TextInput
            style={{
              borderWidth: 1,
              color: "white",
              padding: 10,
              marginTop: 20,
              minHeight: 200, // approx. 4 lines
              textAlignVertical: "top", // aligns text at the top for multiline input
            }}
            className="rounded-xl border-red-600 text-lg"
            multiline={true}
            numberOfLines={8}
            value={description}
            onChangeText={setDescription}
            placeholder="Edit description"
            placeholderTextColor="gray"
          />
          <TextInput
            style={{
              borderWidth: 1,
              color: "white",
              padding: 10,
              marginTop: 20,
            }}
            className="rounded-xl border-red-600 text-lg"
            value={date}
            onChangeText={setDate}
            placeholder="Edit description"
            placeholderTextColor="gray"
          />
          <View className="flex flex-row justify-between items-center mt-2">
            <Text className="text-white font-semibold text-xl">
              Mark as Important / Star
            </Text>
            <Switch
              trackColor={{ false: "#767577", true: "white" }}
              thumbColor={starred ? "red" : "#f4f3f4"}
              onValueChange={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setStarred((previousState) => !previousState);
                setTimeout(() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }, 200);
              }}
              value={starred}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            className="flex flex-row justify-center gap-3 bg-red-600 p-3 rounded-full mt-4"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              handleSave();
            }}
          >
            {/* <AntDesign name="pluscircle" size={24} color="white" /> */}
            <Text className="text-white w-fit text-xl font-semibold">
              Save Changes
            </Text>
          </TouchableOpacity>
          {/* <Button
            title="Save Changes"
            onPress={handleSave}
            color="#f44336"
            className="rounded-xl"
          /> */}
        </>
      ) : (
        <Text style={{ color: "white" }}>Todo not found</Text>
      )}
    </View>
  );
};

export default TodoDetailedView;
