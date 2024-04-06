import React from "react"
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Text } from "react-native"

var ws = new WebSocket('wss://vtc5k01404.execute-api.ap-southeast-2.amazonaws.com/test');

const Keyboard = ({onKeyPress}) => {
  const row1 = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

  return (
    <View style={styles.keyboard}>
      <View style={styles.keyboardRow}>
        {row1.map(number => (
          <TouchableOpacity key={number} onPress={() => onKeyPress(number)}>
            <View style={styles.key}>
              <Text style={styles.keyLetter}>{number}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

export default function App() {
  const [numbers, setNumbers] = React.useState([])
  
  const handleKeyPress = (number) => {
    jsonData = {"action": "sendmessage", "message": number}
    ws.send(JSON.stringify(jsonData))
    
    // console.log(number)
    // newNumbers = [...numbers]
    // newNumbers.push(number)
    // setNumbers(newNumbers)
  }

  ws.onmessage = (e) => {
    number = e.data
    newNumbers = [...numbers]
    newNumbers.push(number)
    setNumbers(newNumbers)
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textView}><Text>Welcome to the Mind</Text></View> 
        {numbers.map(number => (
          <View key={number} style={styles.textView}>
            <Text style={styles.text}>Number is: {number}</Text>
          </View>
        ))}
      <Keyboard onKeyPress={handleKeyPress}/>
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