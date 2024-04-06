import React from "react"
import { StyleSheet, View, Pressable, SafeAreaView, Text } from "react-native"

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

const DealButton = ({onKeyPress}) => {
  return (
    <Pressable onPress={() => onKeyPress(7)}>
      <View style={styles.key}>
        <Text style={styles.keyLetter}>DEAL CARDS</Text>
      </View>
    </Pressable>
  )
}

export default function App() {
  const [numbers, setNumbers] = React.useState([])
  const [cards, setCards] = React.useState([])
  ws.onopen = (e) => {
    console.log("Connected")
  }

  const handleKeyPress = (number) => {
    console.log(number + " pressed")
    jsonData = {"action": "sendmessage", "message": number}
    ws.send(JSON.stringify(jsonData))
  }

  const handleDeal = () => {
    console.log("Attempting to deal")
    jsonData = {"action": "deal", "message": "7"}
    ws.send(JSON.stringify(jsonData))
  }

  ws.onmessage = (e) => {
    response = JSON.parse(e.data)
    
    if (response.handler == "deal") {
      console.log("Message returned: dealing cards")
      setCards(response.message)
    }
    else {
      console.log("Message returned: playing number")
      number = response.message
      newNumbers = [...numbers]
      newNumbers.push(number)
      setNumbers(newNumbers)
    }
    

  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textView}><Text>Welcome to the Mind</Text></View> 
        {numbers.map(number => (
          <View key={number} style={styles.textView}>
            <Text style={styles.text}>Number is: {number}</Text>
          </View>
        ))}
      <Keyboard onKeyPress={handleKeyPress} cards={cards}/>
      <DealButton onKeyPress={handleDeal}/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    flex: 1,
  },
  textView: {
    flexDirection: "row",
    justifyContent: "center",
  },
  text: {
    // marginBottom
  },
  keyboard: { flexDirection: "column" },
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
  },
  keyLetter: {
    fontWeight: "500",
    fontSize: 15,
  },
})