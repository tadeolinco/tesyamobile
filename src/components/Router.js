import React, { useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, View } from 'react-native';
import DBContext from '../context/DBContext';

export const RouterContext = React.createContext({});

function Router({ initialPage, initialPageState, children }) {
  const { db } = useContext(DBContext);

  const [state, setState] = useState({
    page: typeof initialPage === 'undefined' ? '/' : initialPage,
    pageState: typeof initialPageState === 'undefined' ? {} : initialPageState,
  });

  const routerStack = useRef([
    JSON.stringify({
      page: '/',
      pageState: {},
    }),
  ]);

  function changePage(page, pageState = {}) {
    setState({
      page,
      pageState,
    });

    if (
      JSON.stringify({ page, pageState }) !== routerStack.current.slice(-1)[0]
    ) {
      routerStack.current = [
        ...routerStack.current,
        JSON.stringify({ page, pageState }),
      ];
    }
  }

  function handleBackPress() {
    if (routerStack.current.length > 1) {
      const { page, pageState } = JSON.parse(routerStack.current.slice(-2)[0]);
      routerStack.current = routerStack.current.slice(0, -1);
      changePage(page, pageState);

      return true;
    }

    return false;
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  return (
    <RouterContext.Provider
      value={{
        ...state,
        changePage,
      }}
    >
      {db ? (
        children
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator size="large" color="#5e9bea" />
        </View>
      )}
    </RouterContext.Provider>
  );
}

export default Router;
