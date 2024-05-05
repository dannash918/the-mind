import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { SafeAreaView, StyleSheet, KeyboardAvoidingView } from "react-native"
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
  return (
    <SafeAreaProvider style={styles.container} >
       <KeyboardAvoidingView  style={styles.container}>
        <Drawer>
          <Drawer.Screen
            name="index" // This is the name of the page and must match the url from root
            options={{
              drawerLabel: 'Home',
              title: 'Home',
            }}
          />
          <Drawer.Screen
            name="game" // This is the name of the page and must match the url from root
            options={{
              drawerLabel: 'Game',
              title: 'Game',
              drawerItemStyle: { display: 'none' }
            }}
          />
        </Drawer>
      </ KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
})
