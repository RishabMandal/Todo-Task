import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import Todo from "../components/todo";
import AddTodo from "../components/addTodo";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import AntDesign from "@expo/vector-icons/AntDesign";

const todolist = ({ todos, setTodos }) => {
  const d = new Date();

  const router = useRouter();

  const goToDetailedView = (todo) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({ pathname: `/${todo.id}` });
  };

  const [starred, setStarred] = useState("All");
  const [search, setSearch] = useState();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // const renderRightActions = () => {
  //   return (
  //     <View style={{ flexDirection: "row", justifyContent: "center" }}>
  //       <TouchableOpacity
  //         style={{
  //           backgroundColor: "red",
  //           justifyContent: "center",
  //           alignItems: "center",
  //           flex: 1,
  //         }}
  //       >
  //         <Text style={{ color: "white", padding: 20 }}>Delete</Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };
  const [count, setCount] = useState(todos?.length);
  useEffect(() => {
    if (starred === "All") {
      setCount(todos.length);
    } else if (starred === "Pending") {
      setCount(todos.filter((todo) => !todo?.completed).length);
    } else if (starred === "Completed") {
      setCount(todos.filter((todo) => todo?.completed).length);
    } else if (starred === "Starred") {
      setCount(todos.filter((todo) => todo?.starred).length);
    } else {
      setCount(todos.length); // fallback
    }
  }, [starred, todos]);

  return (
    <View className="px-3 pt-8 min-h-screen flex flex-col justify-between">
      <View className="flex flex-row justify-between items-center">
        <View>
          <Text
            className="text-white text-3xl font-semibold"
            onPress={() => {
              router.push("/CalendarTab");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
          >
            {days[d.getDay()]}
          </Text>
          <Text
            className="text-white text-xl"
            onPress={() => {
              router.push("/CalendarTab");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
          >{`${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`}</Text>
        </View>
        <View className="flex flex-row gap-2">
          <Ionicons
            name="shield-checkmark-outline"
            size={38}
            color="white"
            // onPress={() => router.push("/Notifications")}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push("/PasswordManager");
            }}
          />
          <MaterialIcons
            name="account-circle"
            size={40}
            color="white"
            onPress={() => {
              router.push("/Account");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
          />
        </View>
      </View>
      <TextInput
        className="text-white text-xl bg-red-600 rounded-full text-center my-2 p-2"
        placeholder="Search"
        placeholderTextColor="white"
        onChangeText={(text) => setSearch(text)}
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
      />
      <View className="flex flex-row w-full gap-2">
        <Text
          className={`flex-[0.8] ${
            starred === "All" ? "bg-red-600" : "bg-red-400"
          } px-1 py-2 rounded-full text-white text-center font-semibold`}
          onPress={() => {
            setStarred("All");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
        >
          All {starred === "All" && `(${count})`}
        </Text>
        <Text
          className={`flex-1 ${
            starred === "Pending" ? "bg-red-600" : "bg-red-400"
          } px-1 py-2 rounded-full text-white text-center font-semibold`}
          onPress={() => {
            setStarred("Pending");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
        >
          Pending {starred === "Pending" && `(${count})`}
        </Text>
        <Text
          className={`${
            starred === "Completed" ? "bg-red-600" : "bg-red-400"
          } px-1 py-2 rounded-full text-white text-center font-semibold`}
          onPress={() => {
            setStarred("Completed");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
        >
          Completed {starred === "Completed" && `(${count})`}
        </Text>
        <Text
          className={`flex-1 ${
            starred === "Starred" ? "bg-red-600" : "bg-red-400"
          } px-1 py-2 rounded-full text-white text-center font-semibold`}
          onPress={() => {
            setStarred("Starred");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
        >
          Starred {starred === "Starred" && `(${count})`}
        </Text>
      </View>
      <View className="my-2 flex-1 h-full">
        {search?.trim() != null ? (
          <FlatList
            data={todos}
            renderItem={({ item }) => (
              <View>
                {item?.description
                  .toLowerCase()
                  .includes(search.toLowerCase().trim()) && (
                  <View>
                    {starred === "All" && (
                      <TouchableOpacity onPress={() => goToDetailedView(item)}>
                        <Todo
                          todos={todos}
                          setTodos={setTodos}
                          todo={item}
                          onPress={() => goToDetailedView(item)}
                        />
                      </TouchableOpacity>
                    )}
                    {starred === "Starred" && item?.starred === true && (
                      <TouchableOpacity onPress={() => goToDetailedView(item)}>
                        <Todo
                          todos={todos}
                          setTodos={setTodos}
                          todo={item}
                          onPress={() => goToDetailedView(item)}
                        />
                      </TouchableOpacity>
                    )}
                    {starred === "Completed" && item?.completed === true && (
                      <TouchableOpacity onPress={() => goToDetailedView(item)}>
                        <Todo
                          todos={todos}
                          setTodos={setTodos}
                          todo={item}
                          onPress={() => goToDetailedView(item)}
                        />
                      </TouchableOpacity>
                    )}
                    {starred === "Pending" && item?.completed === false && (
                      <TouchableOpacity onPress={() => goToDetailedView(item)}>
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
              </View>
            )}
            keyExtractor={(todo) => todo?.id?.toString()}
          />
        ) : (
          <FlatList
            data={todos}
            renderItem={({ item }) => (
              <View>
                {starred === "All" && (
                  <TouchableOpacity onPress={() => goToDetailedView(item)}>
                    <Todo
                      todos={todos}
                      setTodos={setTodos}
                      todo={item}
                      onPress={() => goToDetailedView(item)}
                    />
                  </TouchableOpacity>
                )}
                {starred === "Starred" && item?.starred === true && (
                  <TouchableOpacity onPress={() => goToDetailedView(item)}>
                    <Todo
                      todos={todos}
                      setTodos={setTodos}
                      todo={item}
                      onPress={() => goToDetailedView(item)}
                    />
                  </TouchableOpacity>
                )}
                {starred === "Completed" && item?.completed === true && (
                  <TouchableOpacity onPress={() => goToDetailedView(item)}>
                    <Todo
                      todos={todos}
                      setTodos={setTodos}
                      todo={item}
                      onPress={() => goToDetailedView(item)}
                    />
                  </TouchableOpacity>
                )}
                {starred === "Pending" && item?.completed !== true && (
                  <TouchableOpacity onPress={() => goToDetailedView(item)}>
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
            keyExtractor={(todo) => todo?.id?.toString()}
          />
        )}
      </View>
      <View>
        <AddTodo />
      </View>
    </View>
  );
};

export default todolist;
