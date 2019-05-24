import React from 'react';
import { StyleSheet, View } from 'react-native';
import Drawer from './components/Drawer';
import Route from './components/Route';
import Router from './components/Router';
import { DBProvider } from './context/DBContext';
import AddBudgetScreen from './screens/AddBudgetScreen';
import AddTransactionScreen from './screens/AddTransactionScreen';
import BudgetScreen from './screens/BudgetScreen';
import HomeScreen from './screens/HomeScreen';
import IncomeScreen from './screens/IncomeScreen';
import TransactionsScreen from './screens/TransactionsScreen';

function App() {
  return (
    <DBProvider>
      <Router initialPage="/">
        <Drawer position="Left">
          <Drawer position="Right">
            <View style={[styles.container]}>
              <Route page="/" component={HomeScreen} />
              <Route page="/add-budget" component={AddBudgetScreen} />
              <Route page="/budget" component={BudgetScreen} />
              <Route
                page={'/add-transaction'}
                component={AddTransactionScreen}
              />
              <Route page={'/transactions'} component={TransactionsScreen} />
              <Route page={'/income'} component={IncomeScreen} />
            </View>
          </Drawer>
        </Drawer>
      </Router>
    </DBProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: 'white',
  },
});

export default App;
