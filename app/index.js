import * as React from 'react';
import { SafeAreaView, StyleSheet, Pressable, Text, View, TextInput } from "react-native";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveUser = async ({user}) => {
    return (
      <View style={styles.keyboard}>
        <View style={styles.keyboardRow}>
          {cards.map(number => (
            <Pressable key={number} onPress={() => onKeyPress(number)}>
              <View style={styles.key}>
                <Text style={styles.keyLetter}>{number}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    )
  }

const App = () => {
    const [name, setName] = React.useState('Fred');
    const [room, setRoom] = React.useState(Math.floor(Math.random() * 10000));
    const navigation = useNavigation();

    const handleNavigate = async () => {
        try {
                await AsyncStorage.setItem('user', name);
        } catch (e) {
            console.log("error saving username")
        }
        navigation.navigate('game', { 
          room: room,
        });
      };

    return (
        <SafeAreaView style={styles.container}>
          <Text style={styles.formLabel}>Welcome to the Mind</Text>
          <View>
            <TextInput 
                placeholder="Name" 
                style={styles.inputStyle}
                onChangeText={newText => setName(newText)}
            />
            <TextInput
              placeholder={room}
              style={styles.inputStyle}
              onChangeText={newText => setRoom(newText)}
            />
            <Pressable onPress={handleNavigate}>
                <View style={styles.key}>
                    <Text style={styles.keyLetter}>Start Game</Text>
                </View>
            </Pressable>
          </View>
        </SafeAreaView>
      );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    formLabel: {
      fontSize: 20,
    },
    inputStyle: {
      marginTop: 20,
      width: 300,
      height: 40,
      paddingHorizontal: 10,
      borderRadius: 50,
      backgroundColor: '#b9e4c9',
    },
    formText: {
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: 20,
    },
    text: {
      color: '#fff',
      fontSize: 20,
    },
    key: {
        backgroundColor: "#d3d6da",
        padding: 10,
        margin: 30,
        borderRadius: 5,
        alignItems: "center"
      },
      keyLetter: {
        fontSize: 15,
        alignItems: "center"
      },
});

export default App;
