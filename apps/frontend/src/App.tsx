import { RouterProvider } from "react-router-dom";
import { AppProvider } from "./providers";
import { router } from "./constants";

export const App: () => JSX.Element = (): JSX.Element => {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}
