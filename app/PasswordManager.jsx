import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Alert,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";
import * as LocalAuthentication from "expo-local-authentication";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import zxcvbn from "zxcvbn";
import { useRouter } from "expo-router";
import { authenticateWithBiometrics } from "../components/biometricAuth";

export default function PasswordManager() {
  const [entries, setEntries] = useState([]);
  const [secureMap, setSecureMap] = useState({});
  const [search, setSearch] = useState("");
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Modal & form state
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    // load entries
    const raw = await AsyncStorage.getItem("passwords");
    if (raw) {
      const parsed = JSON.parse(raw);
      setEntries(parsed);
      const visibility = {};
      parsed.forEach((e) => (visibility[e.id] = true));
      setSecureMap(visibility);
    }
    // biometric support
    const hardware = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setIsBiometricSupported(hardware);
    setIsEnrolled(enrolled);
  };

  //   const authenticateBiometric = async () => {
  //     if (!isBiometricSupported || !isEnrolled) return false;
  //     const result = await LocalAuthentication.authenticateAsync({
  //       promptMessage: "Authenticate to access Password Manager",
  //       cancelLabel: "Cancel",
  //       disableDeviceFallback: false,
  //     });
  //     return result.success;
  //   };

  const filtered = entries.filter((e) =>
    e.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  const toggleSecure = (id) => {
    setSecureMap((prev) => ({ ...prev, [id]: !prev[id] }));
    Haptics.selectionAsync();
  };

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const deleteEntry = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    }, 200);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    }, 400);
    Alert.alert("Delete?", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updated = entries.filter((e) => e.id !== id);
          setEntries(updated);
          await AsyncStorage.setItem("passwords", JSON.stringify(updated));
        },
      },
    ]);
  };

  const openModal = (entry) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    if (entry) {
      setName(entry.name);
      setPassword(entry.password);
      setEditingId(entry.id);
    } else {
      setName("");
      setPassword("");
      setEditingId(null);
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    if (!name || !password) {
      alert("Incorrect or empty name or password!");
      return;
    }
    let updated;
    if (editingId) {
      updated = entries.map((e) =>
        e.id === editingId ? { ...e, name, password } : e
      );
    } else {
      const newEntry = { id: Date.now().toString(), name, password };
      updated = [...entries, newEntry];
      setSecureMap((prev) => ({ ...prev, [newEntry.id]: true }));
    }
    setEntries(updated);
    await AsyncStorage.setItem("passwords", JSON.stringify(updated));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setModalVisible(false);
  };

  const renderItem = ({ item }) => {
    const score = zxcvbn(item.password).score;
    const strength = ["Very Weak", "Weak", "Fair", "Good", "Strong"][score];
    const color = [
      "bg-red-500",
      "bg-orange-400",
      "bg-yellow-400",
      "bg-blue-400",
      "bg-green-500",
    ][score];
    return (
      <View className="border border-gray-200 rounded-xl p-3 mb-2 bg-gray-300">
        <View className="flex-row justify-between">
          <Text className="font-semibold text-gray-800">{item.name}</Text>
          <View className="flex-row space-x-2">
            <Pressable onPress={() => openModal(item)}>
              <Feather name="edit" size={18} color="green" className="pr-2" />
            </Pressable>
            <Pressable onPress={() => deleteEntry(item.id)}>
              <MaterialIcons
                name="delete-outline"
                size={20}
                color="red"
                className="pl-2"
              />
            </Pressable>
          </View>
        </View>
        <View className="flex-row items-center mt-1">
          <Text
            className="flex-1 text-gray-700 text-lg"
            onLongPress={() => copyToClipboard(item.password)}
          >
            {secureMap[item.id] ? "••••••••" : item.password}
          </Text>
          <Pressable onPress={() => toggleSecure(item.id)} className="px-2">
            <Ionicons
              name={secureMap[item.id] ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="gray"
            />
          </Pressable>
          <Pressable
            onPress={() => copyToClipboard(item.password)}
            className="pl-2"
          >
            <Feather name="copy" size={18} color="gray" />
          </Pressable>
        </View>
        <View className="mt-2">
          <View className="h-2 w-full bg-gray-200 rounded-xl-full">
            <View
              className={`${color} h-2 rounded-xl-full`}
              style={{ width: `${(score + 1) * 20}%` }}
            />
          </View>
          <Text className="text-xs text-gray-600">Strength: {strength}</Text>
        </View>
      </View>
    );
  };

  const [isAuth, setIsAuth] = useState(false);
  const authenticate = async () => {
    const isAuthenticated = await authenticateWithBiometrics();
    if (isAuthenticated) {
      setIsAuth(true);
    }
  };
  useEffect(() => {
    authenticate();
  }, []);

  return (
    <View className="px-4 pt-10 bg-black flex-1 rounded-xl-lg shadow w-full max-w-md space-y-4">
      {/* {isBiometricSupported && isEnrolled ? (
        <Pressable
          onPress={async () => {
            const ok = await authenticateBiometric();
            if (!ok) return;
          }}
          className="bg-gray-200 py-2 rounded-xl items-center"
        >
          <Text>Unlock with Biometrics</Text>
        </Pressable>
      ) : (
        <Text className="text-sm text-gray-600">
          Biometrics not available — using manual access.
        </Text>
      )} */}

      {isAuth && (
        <View>
          <View className="flex flex-row justify-between pb-3 items-center">
            <Ionicons
              name="arrow-back-circle-outline"
              size={36}
              color="white"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.back();
              }}
            />
            <Text className="text-white text-2xl font-semibold">
              Password Manager
            </Text>
            <Ionicons
              name="lock-closed-outline"
              size={30}
              color="white"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
                setIsAuth(false);
                authenticate();
              }}
            />
          </View>

          <TextInput
            placeholder="Search by name..."
            placeholderTextColor="#9CA3AF"
            className="border border-red-600 rounded-xl px-3 py-2 text-red-600 text-lg"
            value={search}
            onChangeText={setSearch}
          />

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
              openModal();
            }}
            className="bg-red-600 py-2 rounded-xl items-center justify-center flex-row my-4"
          >
            <MaterialIcons name="add" size={24} color="white" />
            <Text className="text-white font-semibold text-xl">
              Add New Password
            </Text>
          </Pressable>

          {filtered.length > 0 && (
            <FlatList
              data={filtered}
              keyExtractor={(e) => e.id}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 150 }}
            />
          )}

          <Modal visible={modalVisible} animationType="slide" transparent>
            <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
              <View className="bg-gray-200 w-11/12 rounded-2xl p-4 space-y-3">
                <TextInput
                  className="border border-red-600 rounded-xl px-3 py-2 text-red-600"
                  placeholder="App or Website Name"
                  placeholderTextColor="black"
                  value={name}
                  onChangeText={setName}
                />
                <TextInput
                  className="border border-red-600 rounded-xl px-3 py-2 mt-2 mb-4 text-red-600"
                  placeholder="Password"
                  placeholderTextColor="black"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
                {/* Strength meter */}
                <View className="h-2 w-full bg-gray-200 rounded-xl-full">
                  <View
                    className={`h-2 rounded-xl-full ${
                      [
                        "bg-red-500",
                        "bg-orange-400",
                        "bg-yellow-400",
                        "bg-blue-400",
                        "bg-green-500",
                      ][zxcvbn(password || "").score]
                    }`}
                    style={{
                      width: `${(zxcvbn(password || "").score + 1) * 20}%`,
                    }}
                  />
                </View>
                <Text className="text-sm text-gray-600 pt-1">
                  Strength:{" "}
                  {
                    ["Very Weak", "Weak", "Fair", "Good", "Strong"][
                      zxcvbn(password || "").score
                    ]
                  }
                </Text>
                <View className="flex-row justify-end space-x-3 mt-4">
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
                      setModalVisible(false);
                    }}
                    className="px-4 py-2 bg-gray-300 rounded-xl"
                  >
                    <Text className=" font-semibold">Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleSave}
                    className="px-4 py-2 bg-red-600 rounded-xl ml-2"
                  >
                    <Text className="text-white font-semibold">
                      {editingId ? "Update" : "Add"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </View>
  );
}
