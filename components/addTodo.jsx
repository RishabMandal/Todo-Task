import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Switch,
} from "react-native";
import React, { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTodos } from "../app/TodoContext";
import * as Haptics from "expo-haptics";

const AddTodo = () => {
  const { todos, setTodos } = useTodos();

  const [buttonTapped, setButtonTapped] = useState(false);
  const d = new Date();

  const [description, setDescription] = useState();
  const [date, setDate] = useState(
    `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${d.getFullYear()}`
  );
  const [starred, setStarred] = useState(false);

  const handleAdd = () => {

    if (description?.trim()) {
      setTodos((prev) => [
        {
          id: d.toISOString(),
          description: description,
          date,
          starred,
        },
        ...prev,
      ]);
    }
    setButtonTapped(false);
  };

  return (
    <View className="py-3">
      {!buttonTapped ? (
        <TouchableOpacity
          className="flex flex-row justify-center gap-3 bg-red-600 p-3 rounded-full"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setButtonTapped(true);
          }}
        >
          <AntDesign name="pluscircle" size={24} color="white" />
          <Text className="text-white w-fit text-xl">Add new task</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          className="flex flex-row justify-center gap-3 bg-red-600 p-3 rounded-full"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setButtonTapped(false);
          }}
        >
          <MaterialIcons name="cancel" size={24} color="white" />
          <Text className="text-white w-fit text-xl">Cancel</Text>
        </TouchableOpacity>
      )}
      {buttonTapped && (
        <View className="my-2">
          <Text className="text-white font-semibold mt-2">Description</Text>
          <TextInput
            className="border border-red-600 rounded-xl text-white text-xl px-3 my-2 p-2"
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description"
            placeholderTextColor="gray"
          />
          <Text className="text-white font-semibold mt-2">Date</Text>
          <TextInput
            className="border border-red-600 rounded-xl text-white text-xl px-3 my-2 p-2"
            value={date}
            onChangeText={setDate}
            placeholder="Enter date"
            placeholderTextColor="gray"
          />
          <View className="flex flex-row justify-between items-center mt-2">
            <Text className="text-white font-semibold text-xl">
              Mark as important/ Star
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
            className="flex flex-row justify-center gap-3 bg-red-600 p-3 rounded-full mt-48"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setButtonTapped(false);
              handleAdd();
            }}
          >
            <AntDesign name="pluscircle" size={24} color="white" />
            <Text className="text-white w-fit text-xl">Add Task</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default AddTodo;
