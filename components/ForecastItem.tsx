import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react';
import { WeatherForecast } from '../screen/HomeScreen';
import dayjs from 'dayjs';
import { BlurView } from 'expo-blur';

const ForecastItem = ({ forecast }: {forecast: WeatherForecast}) => {
  return (
    <BlurView intensity={20} style={styles.container}>
      <Text style={styles.temp}>{Math.round(forecast.main.temp)}</Text> 
      <Text style={styles.date}>{dayjs(forecast.dt * 1000).format('ddd ha')}</Text>
    </BlurView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    aspectRatio: 13/16,
    borderRadius: 10, 
    alignItems: 'center',
    justifyContent: 'center', 
    overflow: 'hidden', 
    borderColor: 'white', 
    borderWidth: 0.2
  },
  temp: {
    fontSize: 35, 
    color: 'white', 
  }, 
  date: {
    fontWeight: 'bold', 
    fontSize: 16, 
    color: 'white'
  }

})
export default ForecastItem