import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Calendar } from "react-native-calendars";
import { useTodos } from "./TodoContext";
import { FlatList } from "react-native";
import Todo from "../components/todo";
import * as Haptics from "expo-haptics";

const Account = () => {
  const router = useRouter();
  const { todos, setTodos } = useTodos();
  const goToDetailedView = (todo) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({ pathname: `/${todo.id}` });
  };
  return (
    <View
      className="bg-black min-h-[120vh] p-4 pt-10 flex-1"
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
        <Text className="text-white text-xl">Profile</Text>
        <Ionicons name="mic-circle-outline" size={36} color="white" />
      </View>
    </View>
  );
};

export default Account;
