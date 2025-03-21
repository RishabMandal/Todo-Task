import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Calendar } from "react-native-calendars";
import { useTodos } from "./TodoContext";
import { FlatList } from "react-native";
import Todo from "../components/todo";
import * as Haptics from "expo-haptics";

const CalendarTab = () => {
  const router = useRouter();
  const { todos, setTodos } = useTodos();
  const goToDetailedView = (todo) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({ pathname: `/${todo.id}` });
  };
  const d = new Date();
  const [selectedDate, setSelectedDate] = useState(
    `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${d.getFullYear()}`
  );

  const convertDate = (dateString) => {
    const date = new Date(dateString); // Create a Date object from the string
    const day = date.getDate().toString().padStart(2, "0"); // Get day and pad if necessary
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Get month (0-based, so add 1)
    const year = date.getFullYear(); // Get the year

    return `${day}/${month}/${year}`; // Return the formatted date string
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
        <Text className="text-white text-xl">Calendar</Text>
        <Ionicons name="mic-circle-outline" size={36} color="white" />
      </View>
      <View>
        <Calendar
          style={
            {
              // borderWidth: 5,
              // borderColor: "gray",
              // borderRadius: 20,
              // height: 350,
              // backgroundColor: "black"
            }
          }
          theme={{
            backgroundColor: "#171717",
            calendarBackground: "#171717",
            textSectionTitleColor: "red",
            selectedDayBackgroundColor: "green",
            selectedDayTextColor: "#ffffff",
            selectedDotColor: "red",
            todayTextColor: "red",
            dayTextColor: "white",
            textDisabledColor: "gray",
            monthTextColor: "white",
            arrowColor: "red",
            todayBackgroundColor: "white",
          }}
          onDayPress={(day) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setSelectedDate(convertDate(day.dateString));
          }}
          markedDates={{
            [selectedDate]: { selected: true, selectedDotColor: "orange" },
          }}
        />
      </View>
      <Text className="text-white text-2xl py-3">On this day</Text>
      <FlatList
        data={todos}
        renderItem={({ item }) => (
          <View>
            {selectedDate !== undefined ? (
              item?.date.toLowerCase().includes(selectedDate) && (
                <TouchableOpacity
                  onPress={() => {
                    goToDetailedView(item);
                  }}
                >
                  <Todo
                    todos={todos}
                    setTodos={setTodos}
                    todo={item}
                    onPress={() => goToDetailedView(item)}
                  />
                </TouchableOpacity>
              )
            ) : (
              <TouchableOpacity
                onPress={() => {
                  goToDetailedView(item);
                }}
              >
                <Todo
                  todos={todos}
                  setTodos={setTodos}
                  todo={item}
                  onPress={() => goToDetailedView(item)}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
        keyExtractor={(todo) => todo.id.toString()}
      />
    </View>
  );
};

export default CalendarTab;
