import React, { useContext, useRef } from 'react';
import {
  DrawerLayoutAndroid,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { STYLES } from '../global-styles';
import { RouterContext } from './Router';

function Drawer({ position, children }) {
  const { changePage } = useContext(RouterContext);
  const drawerRef = useRef();

  function handleChangePage(page, state) {
    drawerRef.current.closeDrawer();
    changePage(page, state);
  }

  // function handleBackPress() {
  //   drawerRef.current.closeDrawer();
  //   return true;
  // }

  return (
    <DrawerLayoutAndroid
      ref={drawerRef}
      drawerBackgroundColor="transparent"
      drawerWidth={150}
      drawerPosition={DrawerLayoutAndroid.positions[position]}
      onDrawerOpen={() => {
        Keyboard.dismiss();
        // BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      }}
      onDrawerClose={() => {
        // BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      }}
      renderNavigationView={() => {
        return (
          <View style={[styles.drawerContainer]}>
            <TouchableOpacity
              activeOpacity={0.95}
              style={[styles.drawerButton, { backgroundColor: '#7ace68' }]}
              onPress={() => {
                handleChangePage('/cash');
              }}
            >
              <Text style={[styles.drawerButtonText]}>CASH</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.95}
              style={[styles.drawerButton, { backgroundColor: '#7ace68' }]}
              onPress={() => {
                handleChangePage('/add-budget');
              }}
            >
              <Text style={[styles.drawerButtonText]}>ADD BUDGET</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.95}
              style={[styles.drawerButton, { backgroundColor: '#b3b3b3' }]}
              onPress={() => {
                handleChangePage('/add-transaction');
              }}
            >
              <Text style={[styles.drawerButtonText]}>ADD TRANSACTION</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.95}
              style={[styles.drawerButton, { backgroundColor: '#b3b3b3' }]}
              onPress={() => {
                handleChangePage('/transactions', { budget: null });
              }}
            >
              <Text style={[styles.drawerButtonText]}>ALL TRANSACTIONS</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.95}
              underlayColor="white"
              style={[styles.drawerButton, { backgroundColor: '#5e9bea' }]}
              onPress={() => {
                handleChangePage('/');
              }}
            >
              <Text style={[styles.drawerButtonText]}>DASHBOARD</Text>
            </TouchableOpacity>
          </View>
        );
      }}
    >
      {children}
    </DrawerLayoutAndroid>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  drawerButton: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerButtonText: {
    ...STYLES.TEXT,
    textAlign: 'center',
    color: 'white',
  },
});

export default Drawer;
