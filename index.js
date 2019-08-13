/** @format */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import Intro from './src/screens/Intro';

AppRegistry.registerComponent(appName, () => App);
