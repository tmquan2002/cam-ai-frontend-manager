import { BrowserRouter } from "react-router-dom";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import "./App.css";
import AppRoute from "./routes/AppRoute";
import { QueryClient, QueryClientProvider } from "react-query";
import { SessionProvider } from "./context/AuthContext";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { MantineProvider, createTheme, rem } from "@mantine/core";
import { light_blue, light_yellow, pale_red, shading } from "./types/constant";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      cacheTime: 0,
    },
  },
});

const theme = createTheme({
  primaryColor: "light-blue",
  colors: {
    "light-yellow": light_yellow,
    "light-blue": light_blue,
    "pale-red": pale_red,
    shading: shading,
  },
  cursorType: "pointer",
});

//TODO: Add a new page to show import result for notification button and notification progress bar
function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <ModalsProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <SessionProvider>
              <Notifications position="top-right" mt={rem(40)} />
              <AppRoute />
            </SessionProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;
