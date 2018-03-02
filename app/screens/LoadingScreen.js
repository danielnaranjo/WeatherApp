import React, { Component } from 'react';
import { AsyncStorage, View } from 'react-native';
import PropTypes from 'prop-types';

class LoadingScreen extends Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: 'gold',
      elevation: 0,
      borderBottomWidth: 0,
    },
  };

  async componentDidMount() {
    // AsyncStorage.clear();
    const value = await AsyncStorage.getItem('@SKIP_INTRO');
    if (value !== null || value === 'true') {
      this.props.navigation.navigate('Home');
    } else {
      this.props.navigation.navigate('Intro');
    }
  }

  render() {
    return <View style={{ flex: 1, backgroundColor: 'gold' }} />;
  }
}

LoadingScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default LoadingScreen;
