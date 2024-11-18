import React, { FC, useMemo } from 'react';
import { RouterProvider } from "react-router-dom";

import { renderRoutes } from '/imports/config/router';

const App: FC = (props) => {
  const router = useMemo(() => renderRoutes(), []);

  return (
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true
      }}
    />
  )
};

export default App;