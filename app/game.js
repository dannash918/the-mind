import React, { useState, useEffect } from "react";
import { StyleSheet, View, Pressable, SafeAreaView, ScrollView, Text, Image } from "react-native"
import {Picker} from '@react-native-picker/picker';
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import giphyLogo from'../assets/powered_by_giphy.png';

const Keyboard = ({cards, onKeyPress, gameState}) => {
  return (
    <View style={styles.keyboard}>
      <View style={styles.keyboardRow}>
        {cards.map(number => (
          <Pressable key={number} disabled={gameState != "play"} onPress={() => onKeyPress(number)}>
            <View style={gameState === "play" ? styles.card : styles.fadedCard}>
              <Text style={styles.cardText}>{number}</Text>
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

const DealButton = ({onKeyPress, gameState}) => {
  return (
    <Pressable onPress={() => onKeyPress(7)} >
      <View style={styles.dealButton}>
        <Text style={styles.dealButtonText}>DEAL CARDS</Text>
      </View>
    </Pressable>
  )
}

const gifStyle = (gif) => {
  let gifHeight = parseInt(gif.height)
  let gifWidth = parseInt(gif.width)
  let newHeight = (250 / gifWidth) * gifHeight
  
  let gifStyle = {
    height: newHeight,
    width: 250,
    marginTop: "10px",
  }
  
  return gifStyle
}

export default function Game({}) {
  const [numbers, setNumbers] = React.useState([])
  const [cards, setCards] = React.useState([])
  const [cardsToDeal, setCardsToDeal] = React.useState(4);
  const [name, setName] = React.useState('Fred');
  const params = useLocalSearchParams();
  const { room } = params;
  const [ws, setWs] = React.useState(null)
  const [text, setText] = React.useState([])
  const [totalCards, setTotalCards] = React.useState()
  const [playedCards, setPlayedCards] = React.useState(0)
  const [gifs, setGifs] = useState([]);
  const [gameState, setGameState] = React.useState()
  const [endMessages, setEndMessages] = React.useState([])

  useEffect(() => {
    const firstLoad = async () => {
      try {
        const nickName = await AsyncStorage.getItem("user");
        ms = { room: room, user: nickName }
        setName(nickName);
        const ws = new WebSocket(`wss://kke8tbr1y5.execute-api.ap-southeast-2.amazonaws.com/test?room=${room}`)
        setWs(ws)
      } catch (err) {
        console.log(err);
      }
      };
    firstLoad();
  }, []);

  useEffect(() => {
    if (gameState != "win" && gameState != "lose") {
      return
    }
    let message = gameState === "win" ? endMessages[0] : endMessages[1] 
    console.log(message)
    let trimmedMessage = message.replace(/^"(.*)"$/, '$1');
    let newText = [...text]
    newText.push(trimmedMessage)
    setText(newText)  
  }, [gameState]); 

  

  useEffect(() => {
    if (ws == null) {return}
    ws.onopen = (e) => {
      console.log("Connected: " + name)
      ms = {room: room, user: name}
      jsonData = {"action": "join", "message": ms}
      ws.send(JSON.stringify(jsonData))  
    }
    
    ws.onmessage = function (event) {
      response = JSON.parse(event.data)
      if (response.handler == "deal") {
        console.log("Message returned: dealing cards")
        console.log("Cards: " + response.cards)
        console.log("Total Cards: " + response.totalCards)
        console.log("Gif URL: " + JSON.stringify(response.gifs[0])) 
        setNumbers([])
        setText([])
        setCards([])
        setPlayedCards(0)
        setGameState("play")
        setEndMessages(response.endMessages)    
        setCards(response.cards)        
        setGifs(response.gifs)
        setTotalCards(response.totalCards)
      }
      if (response.handler == "playCard") {
        newPlayedCards = playedCards + 1
        setPlayedCards(newPlayedCards)
        console.log("Message returned: playing number")
        number = response.card
        player = response.player
        newNumbers = [...numbers]
        newNumbers.push(number)
        setNumbers(newNumbers)
        newText = [...text]
        const newLine = `${player} played: ${number}`
        newText.push(newLine)
        setText(newText)
        setGameState(response.gameState)
      }
      if (response.handler == "join") {
        console.log("Someone joined the room: " + response.user + "Room: " + response.room)
        const newLine = `${response.user} joined the room`
        newText = [...text]
        newText.push(newLine)
        setText(newText)
      }
    };
  });   

  const handleKeyPress = (number) => {
    console.log(number + " pressed")
    jsonData = {"action": "playCard", "card": number, "player": name, "room": room}
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
    ms = {room: room, cards: cardsToDeal}
    jsonData = {"action": "deal", "room": room, "numCards": cardsToDeal}
    ws.send(JSON.stringify(jsonData))
    setNumbers([])
    setText([])
    setCards([])
    setPlayedCards(0)
    setGameState("play")
  }  
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerView}>
        {room && <Text style={styles.headerText}>Room: {room}</Text>}
        {totalCards && <Text style={styles.headerText}>Cards Played: {playedCards} / {totalCards}</Text>}
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle ={styles.scrollText} ref={ref => {this.scrollView = ref}} onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}>
      {text.map((t, idx) => (
        <Text key={idx} style={styles.text}>{t}</Text>
      ))}
      {(gameState === "win") && <View><Image source={{ uri: gifs[1].url }} style={gifStyle(gifs[1])} /><Image source={giphyLogo} style={styles.poweredGif} /></View>}
      {(gameState === "lose") && <View><Image source={{ uri: gifs[0].url }} style={gifStyle(gifs[0])} /><Image source={giphyLogo} style={styles.poweredGif} /></View>}
      </ScrollView>
      <View style={styles.base}>
        <Keyboard onKeyPress={handleKeyPress} cards={cards} gameState={gameState} />
        <View style={styles.dealRow}>
          <DealButton gameState={gameState} onKeyPress={handleDeal} />
          <DealPicker cardsToDeal={cardsToDeal} setCardsToDeal={setCardsToDeal} />
        </View>
      </View>
    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,    
  },
  headerView: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: "10px",
  },
  headerText: {
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    marginTop: "20px",
    marginBottom: "20px",
  },
  scrollText: {
    alignItems: "center",
  },
  gif: {
    width: 200,
    height: 200,
    marginTop: "10px",
  },
  poweredGif: {
    width: 75,
    height: 27,
    marginLeft: "175px",
    marginTop: "-27px",
  },
  text: {
    marginTop: "10px",
    marginLeft: "30px",
    marginRight: "30px"
  },
  base: {
    alignContent: "flex-end",
    marginTop: "auto",
    marginBottom: "auto",
    justifyContent: "center",
    marginBottom: "15px",
  },
  keyboard: { 
    flexDirection: "row",
    justifyContent: "center",
  },
  keyboardRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  fadedCard: {
    backgroundColor: "#d3d6da",
    padding: 10,
    margin: 3,
    borderRadius: 5,
    alignItems: "center",
    opacity: "50%"
  },
  card: {
    backgroundColor: "#d3d6da",
    padding: 10,
    margin: 3,
    borderRadius: 5,
    alignItems: "center"
  },
  cardText: {
    fontSize: 20,
    alignItems: "center"
  },
  dealButton: {
    backgroundColor: "#d3d6da",
    padding: 10,
    margin: 3,
    borderRadius: 5,
    alignItems: "center"
  },
  dealButtonText: {
    fontSize: 15,
    alignItems: "center"
  },
  dealRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly"
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
