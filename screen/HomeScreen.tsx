import { View, Text, ActivityIndicator, StyleSheet, FlatList, SafeAreaView, ImageBackground, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Location from 'expo-location';
import ForecastItem from '../components/ForecastItem';
import { BlurView } from 'expo-blur';

const BASE_URL = `https://api.openweathermap.org/data/2.5`;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const bgImage = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg'

type MainWeather = {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level: number;
  grnd_level: number;
}

type weather = {
  name: string;
  main: MainWeather
}

export type WeatherForecast = {
  main: MainWeather;
  dt: number;
}

const getWeathersIcon = (temp: number) => {
  const cloudy = require('../assets/cloud.png');
  const partlyCoudy = require('../assets/cloudy.png');
  const rainy = require('../assets/heavy-rain.png');
  const sunny = require('../assets/sun.png');

  if (temp < 10) {
    return partlyCoudy;
  } else if (temp <= 10 && temp == 0) {
    return cloudy
  } else if (temp == 15) {
    return rainy
  }else if (temp == 16 && temp > 20){
    return sunny
  } else {
    return partlyCoudy;
  }
}

const HomeScreen = () => {
  const [weather, setWeather] = useState<weather>();
  const [location, setLocation] = useState<Location.LocationObject>(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [forecast, setForecast] = useState<WeatherForecast[]>();

  const fetchWeather = async () => {
    const lat = location?.coords.latitude
    const lon = location?.coords.longitude
    console.log("Fetch Data");
    const results = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const data = await results.json();
    // console.log(JSON.stringify(data, null, 2)); 
    setWeather(data);
  }
  useEffect(() => {
    if (location) {
      fetchWeather();
      fetchForecast();
    }
  }, [location]);

  const fetchForecast = async () => {
    if (!location) {
      return;
    }
    const results = await fetch(
      `${BASE_URL}/forecast?lat=${location?.coords.latitude}&lon=${location?.coords.longitude}&appid=${API_KEY}&units=metric`
    );
    const data = await results.json();
    console.log(JSON.stringify(data, null, 2));
    setForecast(data.list);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      console.log('location: ', location);
      setLocation(location);
    })();
  }, []);

  if (!weather) {
    return <ActivityIndicator />
  }

  const weatherIcon = getWeathersIcon(Math.round(weather.main.temp));
 
  return (
    <SafeAreaView style={style.container}>
      <ImageBackground source={{ uri: bgImage }}>
        <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0 , 0.2)' }} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={style.location}>{weather.name}</Text>
          <Text style={style.temp}>{Math.round(weather.main.temp)}</Text>
          <BlurView intensity={10}>
          <Image source={weatherIcon} style={style.weatherIcon} />
          </BlurView>


        </View>


        <FlatList
          data={forecast}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            flexGrow: 0,
            height: 150,
            marginBottom: 40,
          }}
          contentContainerStyle={{ gap: 50, paddingHorizontal: 10 }}
          renderItem={({ item }) => (
            <View>
              <ForecastItem forecast={item} />
            </View>)}
        />
      </ImageBackground>
    </SafeAreaView>
  )
};


const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: 'center',
    justifyContent: 'center',
  },
  location: {
    fontFamily: "Roboto",
    fontSize: 40,
    color: 'lightgray'
  },
  temp: {
    fontFamily: 'Roboto',
    fontSize: 100,
    color: "white",
    alignItems: 'center',
    justifyContent: 'center'
  }, 
  weatherIcon: {
    width: 100,
    height: 100,
    marginBottom: 10,
  }
})

export default HomeScreen

function getWeatherIcon(arg0: number) {
  throw new Error('Function not implemented.');
}
