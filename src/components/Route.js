import React, { useContext } from 'react';
import { RouterContext } from './Router';

function Route({ page, component }) {
  const { page: currentPage, pageState } = useContext(RouterContext);

  const Component = component;

  if (currentPage === page && Component) {
    return <Component pageState={pageState} />;
  }

  return null;
}

export default Route;
