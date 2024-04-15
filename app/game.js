import React, { useState, useEffect } from "react";
import { StyleSheet, View, Pressable, SafeAreaView, Text } from "react-native"
import {Picker} from '@react-native-picker/picker';
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

var ws = new WebSocket('wss://kke8tbr1y5.execute-api.ap-southeast-2.amazonaws.com/test/');

const Keyboard = ({cards, onKeyPress}) => {
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

const DealPicker = ({cardsToDeal, setCardsToDeal }) => {
  const cardDeals = [
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 },
    { label: "5", value: 5 },
    { label: "6", value: 6 },
    { label: "7", value: 7 },]
  return (
    <Picker
      style={styles.dealPicker}
      itemStyle={styles.dealPickerItem}
      selectedValue={cardsToDeal}
      onValueChange={(itemValue) =>
        setCardsToDeal(itemValue)
      }>
        {cardDeals.map(card => (
          <Picker.Item key={card.value} label={card.label} value={card.value} />
        ))}  
    </Picker>
  )
}

const DealButton = ({onKeyPress, text}) => {
  return (
    <Pressable onPress={() => onKeyPress(7)}>
      <View style={styles.key}>
        <Text style={styles.keyLetter}>{text}</Text>
      </View>
    </Pressable>
  )
}

export default function Game({}) {
  const [numbers, setNumbers] = React.useState([])
  const [cards, setCards] = React.useState([])
  const [cardsToDeal, setCardsToDeal] = React.useState(4);
  const [name, setName] = React.useState('Fred');
  const params = useLocalSearchParams();
  const { room } = params;

  useEffect(() => {
      const firstLoad = async () => {
        try {
          const nickName = await AsyncStorage.getItem("user");
          setName(nickName);
        } catch (err) {
          console.log(err);
        }
      };
    firstLoad();
    }, []);

  ws.onopen = (e) => {
    console.log("Connected")
  }

  const handleKeyPress = (number) => {
    console.log(number + " pressed")
    jsonData = {"action": "sendmessage", "message": number}
    ws.send(JSON.stringify(jsonData))
    
    // remove from cards
    newCards = [...cards]
    const index = newCards.indexOf(number)
    if (index > -1) {
      newCards.splice(index, 1)
    }
    setCards(newCards)
  }

  const handleDeal = () => {
    console.log("Attempting to deal")
    jsonData = {"action": "deal", "message": cardsToDeal}
    ws.send(JSON.stringify(jsonData))
  }

  // Deal Event Listener
  ws.addEventListener("message", function(event) {
    response = JSON.parse(event.data)
    if (response.handler == "deal") {
      console.log("Message returned: dealing cards")
      console.log(response.message)
      setNumbers([])
      setCards(response.message)
    }
  });

  // Play Number Listener
  ws.addEventListener("message", function(event) {
    response = JSON.parse(event.data)
    if (response.handler == "playNum") {
      console.log("Message returned: playing number")
      number = response.message
      newNumbers = [...numbers]
      newNumbers.push(number)
      setNumbers(newNumbers)
    }
  });
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome to the Mind.</Text>
      </View> 
      <View style={styles.header}>
        <Text >Name: {name} Room: {room}</Text>
      </View> 
      <View style={styles.textView}>
      {numbers.map(number => (
          <Text key = {number} style={styles.text}>Number is: {number}</Text>
      ))}
      </View>
      <View style={styles.base}>
        <Keyboard onKeyPress={handleKeyPress} cards={cards}/>
        <View style={styles.deal}>
          <DealButton style={styles.dealButton} text="DEAL CARDS" onKeyPress={handleDeal}/>
          <DealPicker cardsToDeal={cardsToDeal} setCardsToDeal={setCardsToDeal}/>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "20px",
  },
  headerText: {
    fontWeight: 'bold',
  },
  textView: {
    alignItems: "center",
    marginTop: "auto",
    marginBottom: "auto",
    flexGrow: 1,
  },
  text: {
    marginTop: "10px"
  },
  keyboard: { 
    flexDirection: "row",
    justifyContent: "center",
  },
  base: {
    marginTop: "auto",
    justifyContent: "center",
    marginBottom: "15px",
  },
  keyboardRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  key: {
    backgroundColor: "#d3d6da",
    padding: 10,
    margin: 3,
    borderRadius: 5,
    alignItems: "center"
  },
  keyLetter: {
    fontSize: 15,
    alignItems: "center"
  },
  deal: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  dealButton: {
    
  },
  dealPicker: {
    width: 100,
    height: 44,
    backgroundColor: '#F5F9FF',
    borderColor: 'black',
    borderWidth: 1,
    justifyContent: "center",
    textAlign: 'center',
  },
  dealPickerItem: {
    height: 44,
    color: 'red',
    justifyContent: "center",
    textAlign: 'center',
  },
})