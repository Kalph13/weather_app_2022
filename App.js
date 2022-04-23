import { React, useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import { Fontisto } from "@expo/vector-icons";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const time = new Date();

export default function App() {
  const [ ok, setOk ] = useState(true);
  const [ city, setCity ] = useState("");
  const [ days, setDays ] = useState([]);
  const API_KEY = "f0ed8605a6391457b3f623bc8aee5338";
  const icons = {
    Clouds: "cloudy",
    Clear: "day-sunny",
    Atmosphere: "cloudy-gusts",
    Snow: "snow",
    Rain: "rains",
    Drizzle: "rain",
    Thunderstorm: "lightning"
  };
  
  const getWeather = async() => {
    const { granted } = await Location.requestForegroundPermissionsAsync();    
    if(!granted) setOk(false);    
    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false })
    setCity(location[0].region);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&exclude=alerts&lon=${longitude}&appid=${API_KEY}&units=metric`)
    const json = await response.json();
    setDays(json.daily);
  }

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView 
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? <View style={styles.day}>
          <ActivityIndicator color="black" size="large" style={{ marginTop: 10 }}/>
        </View> : days.map((day, index) => <View key={index} style={styles.day}>
          {index === 0 ? <Text style={styles.date}>Today</Text> : <Text style={styles.date}>D+{index}</Text> }
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%"}}>
            <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
            <Fontisto name={icons[day.weather[0].main]} size={SCREEN_WIDTH/6} color="black" />
          </View>
          <Text style={styles.maxmin}>Min {parseFloat(day.temp.min).toFixed(1)}      Max {parseFloat(day.temp.max).toFixed(1)}</Text>
          <Text style={styles.description}>{day.weather[0].main}</Text>
          <Text style={styles.tinyText}>{day.weather[0].description}</Text>

        </View>)}
      </ScrollView> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gold",
  },
  city: {
    flex: 1.5,
    justifyContent: "center",
    alignItems: "center"
  },
  cityName: {
    marginTop: SCREEN_HEIGHT/12,
    fontSize: SCREEN_WIDTH/8,
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center"
  },
  date: {
    marginTop: SCREEN_HEIGHT/12,
    fontSize: SCREEN_WIDTH/18,
  },
  temp: {
    marginTop: 0,
    fontSize: SCREEN_WIDTH/4,
    fontWeight: "bold"
  },
  maxmin: {
    marginTop: SCREEN_HEIGHT/50,
    fontSize: SCREEN_WIDTH/15
  },
  description: {
    marginTop: SCREEN_HEIGHT/25,
    fontSize: SCREEN_WIDTH/9
  },
  tinyText: {
    fontSize: SCREEN_WIDTH/21
  }
});