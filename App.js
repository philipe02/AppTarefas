import React, { useCallback, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  FlatList,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TaskList from "./src/components/TaskList";
import * as Animatable from "react-native-animatable";

const AnimatableBtn = Animatable.createAnimatableComponent(TouchableOpacity);

export default function App() {
  const [task, setTask] = useState([]);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    async function loadTask() {
      const taskStorage = await AsyncStorage.getItem("@task");
      if (taskStorage) {
        setTask(JSON.parse(taskStorage));
      }
    }
    loadTask();
  }, []);

  useEffect(() => {
    async function saveTasks() {
      await AsyncStorage.setItem("@task", JSON.stringify(task));
    }
    saveTasks();
  }, [task]);
  function handleAdd() {
    if (input === "") return;

    const data = {
      key: input,
      task: input,
    };
    setTask([...task, data]);
    setOpen(false);
    setInput("");
  }
  const handleDelete = useCallback((data) => {
    const find = task.filter((r) => r.key !== data.key);
    setTask(find);
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#002e20" barStyle="light-content"></StatusBar>

      <View style={styles.content}>
        <Text style={styles.title}>Minhas tarefas</Text>
      </View>

      <FlatList
        marginHorizontal={10}
        showsHorizontalScrollIndicator={false}
        data={task}
        keyExtractor={(item) => String(item.key)}
        renderItem={({ item }) => (
          <TaskList data={item} handleDelete={handleDelete} />
        )}
      />

      <Modal
        animationType="slide"
        transparent={false}
        visible={open}
        useNativeDriver
      >
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setOpen(false)}>
              <Ionicons
                style={{ marginLeft: 5, marginRight: 5 }}
                name="md-arrow-back"
                size={40}
                color="#DDD"
              />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Nova tarefa</Text>
          </View>

          <Animatable.View
            style={styles.modalBody}
            animation="bounceInUp"
            useNativeDriver
          >
            <TextInput
              multiline={true}
              autoCorrect={false}
              style={styles.input}
              placeholder="O que precisa fazer hoje?"
              value={input}
              onChangeText={(texto) => setInput(texto)}
            />

            <TouchableOpacity style={styles.handleAdd} onPress={handleAdd}>
              <Text style={styles.handleAddText}>Adicionar tarefa</Text>
            </TouchableOpacity>
          </Animatable.View>
        </SafeAreaView>
      </Modal>

      <AnimatableBtn
        style={styles.fab}
        useNativeDriver
        animation="bounceInRight"
        duration={1000}
        onPress={() => setOpen(true)}
      >
        <Ionicons name="ios-add" size={35} color="#DDD" />
      </AnimatableBtn>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#002e20",
  },
  title: {
    marginTop: 10,
    paddingBottom: 10,
    fontSize: 30,
    textAlign: "center",
    color: "#DDD",
  },
  fab: {
    position: "absolute",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    right: 25,
    bottom: 30,
    elevation: 2,
    zIndex: 9,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 1,
      height: 3,
    },
    backgroundColor: "#44BB44",
  },
  modal: {
    flex: 1,
    backgroundColor: "#002e20",
  },
  modalHeader: {
    marginLeft: 10,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  modalTitle: {
    marginLeft: 15,
    fontSize: 30,
    color: "#DDD",
  },
  modalBody: {
    marginTop: 15,
  },
  input: {
    fontSize: 20,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 30,
    backgroundColor: "#DDD",
    padding: 9,
    height: 85,
    textAlignVertical: "top",
    color: "#222",
    borderRadius: 5,
  },
  handleAdd: {
    backgroundColor: "#DDD",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    marginRight: 10,
    height: 40,
    borderRadius: 5,
  },
  handleAddText: {
    fontSize: 20,
  },
});
