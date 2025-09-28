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
  const d = new Date();
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
        <Text className="text-white text-2xl font-semibold">Profile</Text>
        <Ionicons name="mic-circle-outline" size={36} color="white" />
      </View>
      <View>
        <Text className="text-center text-white font-bold text-xl mt-2">
          Crafted & created by Rishab Mandal
        </Text>
        <Text className="text-center text-white font-semibold text-xl">
          © 2025-{d.getFullYear()}
        </Text>
      </View>
    </View>
  );
};

export default Account;
