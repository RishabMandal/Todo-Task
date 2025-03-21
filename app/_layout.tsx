// app/_layout.js
import React from "react";
import { Stack } from "expo-router";
import { TodoProvider } from "./TodoContext"; // Import the TodoProvider

export default function RootLayout() {
  return (
    <TodoProvider>
      <Stack screenOptions={{ headerShown: false }}></Stack>
      {/* <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "black",
            },
            }}
            ></Stack> */}
    </TodoProvider>
  );
}
