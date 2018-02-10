import React, { Component } from 'react';
import { StyleSheet, Dimensions, View, AsyncStorage } from 'react-native';
import axios from 'axios';
import Modal from 'react-native-modal';
import { BallIndicator } from 'react-native-indicators';
import SlideGroup from '../components/SlideGroup';
import SlideItem from '../components/SlideItem';
import Button from '../components/Button';
import Search from '../components/Search';
import darkSkyAPI from '../config/darkSky';

class WeatherScreen extends Component {
  static navigationOptions = {
    title: 'Current weather',
    headerTintColor: 'black',
    headerStyle: {
      backgroundColor: 'gold',
      elevation: 0,
      borderBottomWidth: 0,
    },
  };

  state = {
    cities: [],
    isLoading: false,
    isFetching: false,
    isModalVisible: false,
    activeSlide: 0,
  };

  componentDidMount = async () => {
    // await AsyncStorage.removeItem('cities');
    this.fetchData();
  };

  onSnapToItem = index => this.setState({ activeSlide: index });

  onPress = async (data, details = null) => {
    try {
      await this.addCity(
        details.name,
        details.geometry.location.lat,
        details.geometry.location.lat,
      );
    } catch (error) {
      console.log(error);
    }
  };

  fetchData = async () => {
    try {
      this.setState(prevState => ({ isFetching: !prevState.isFetching }));
      const result = await AsyncStorage.getItem('nextCities');
      if (result !== null || undefined) {
        const cities = JSON.parse(result);
        cities.map(city => this.addCity(city.city, city.lat, city.lon));
      }
      this.setState(prevState => ({ isFetching: !prevState.isFetching }));
    } catch (error) {
      console.log(error);
    }
  };

  toggleModal = () => this.setState(prevState => ({ isModalVisible: !prevState.isModalVisible }));
  closeModal = () => this.setState({ isModalVisible: false });

  addCity = async (city, lat, lon) => {
    try {
      this.setState(prevState => ({ isLoading: !prevState.isLoading }));
      const forecast = await this.addForecast(lat, lon);
      this.setState(prevState => ({
        cities: [
          ...prevState.cities,
          {
            city,
            lat,
            lon,
            forecast,
          },
        ],
      }));
      console.log(this.state.cities);
      const { cities } = this.state;
      const nextCities = cities.map(each => ({
        city: each.city,
        lat: each.lat,
        lon: each.lon,
      }));
      console.log(nextCities);
      await AsyncStorage.setItem('nextCities', JSON.stringify(nextCities));
      this.setState(prevState => ({ isLoading: !prevState.isLoading }));
      this.closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  addForecast = async (lat, lon) => {
    const result = await axios.get(`https://api.darksky.net/forecast/${darkSkyAPI}/${lat},${lon}?exclude=hourly,flags&units=ca`);
    return result;
  };

  renderItem = ({ item }) => <SlideItem item={item} />;

  render() {
    return (
      <View style={styles.container}>
        <Modal isVisible={this.state.isModalVisible}>
          <View style={styles.modalContainer}>
            <Search onPress={this.onPress} />
            {this.state.isLoading ? <BallIndicator /> : null}
            <Button
              onPress={() => this.toggleModal()}
              title="Close"
              style={{ backgroundColor: 'black' }}
            />
          </View>
        </Modal>
        <SlideGroup
          data={this.state.cities}
          renderItem={this.renderItem}
          onSnapToItem={this.onSnapToItem}
          activeSlide={this.state.activeSlide}
        />
        {this.state.isFetching ? <BallIndicator /> : null}
        <Button
          onPress={() => this.toggleModal()}
          title="Add City"
          style={{ backgroundColor: 'black' }}
        />
      </View>
    );
  }
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gold',
    paddingBottom: 10,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  modalContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'gold',
    height: height * 0.6,
  },
});

export default WeatherScreen;
