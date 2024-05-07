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
import { MantineProvider, createTheme } from "@mantine/core";
import { light_blue, light_yellow, pale_red, shading } from "./types/constant";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

const theme = createTheme({
  // fontFamily: "DVN-Poppins",
  primaryColor: "light-blue",
  colors: {
    "light-yellow": light_yellow,
    "light-blue": light_blue,
    "pale-red": pale_red,
    shading: shading,
  },
});

// TODO: Check all table UI
//1. Table design and padding (left, right)
//2. Table pageSize with accurate index
//3. Status field
//4. Add tooltip and blue color to clickable links or add tooltip for entire row
//5. Breadcrumb

//TODO: Fix form don't have managerId
//TODO: Brand Update Employee page
//TODO: Merge edge box and camera and shop detail page
//TODO: View Shop Manager info and add assign button
//TODO: Check and redesign status badges using reusable badge components
function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <ModalsProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <SessionProvider>
              <Notifications position="top-right" />
              <AppRoute />
            </SessionProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;
