import React from "react";
import { Meteor } from "meteor/meteor";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";


import { initLogger } from "/imports/utils/console.util";
import { initDayjs } from "/imports/utils/dayjs.util";

// Import the generated route tree
import { routeTree } from "/imports/config/routes/routeTree.gen";

initDayjs();

// Create a new router instance
const router = createRouter({ routeTree } as any);

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

Meteor.startup(() => {
  const container = document.getElementById("react-target");

  if (!container.innerHTML) {
    const root = createRoot(container);

    initLogger();

    root.render(
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    );
  }
});
