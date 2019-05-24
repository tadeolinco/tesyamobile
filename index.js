import { AppRegistry, YellowBox } from 'react-native';
import { name as appName } from './app.json';
import App from './src/App';

YellowBox.ignoreWarnings(['Remote debugger']);

console.log(appName);

AppRegistry.registerComponent(appName, () => App);
