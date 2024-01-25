import { BrowserRouter } from "react-router-dom";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/notifications/styles.css";
import "./App.css";
import AppRoute from "./routes/AppRoute";
import { QueryClient, QueryClientProvider } from "react-query";
import { SessionProvider } from "./context/AuthContext";
import { Notifications } from "@mantine/notifications";
import { MantineProvider, createTheme } from "@mantine/core";
// import { light_blue, light_yellow, pale_red, shading } from "./types/constant";
import { light_yellow, pale_red, shading } from "./types/constant";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 0,
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

const theme = createTheme({
  colors: {
    "light-yellow": light_yellow,
    "pale-red": pale_red,
    shading: shading,
  },
});

function App() {
  return (
    <MantineProvider
      theme={theme}
      defaultColorScheme="light"
    >
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <SessionProvider>
            <Notifications position="top-right" />

            <AppRoute />
          </SessionProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </MantineProvider>
  );
}

export default App;
