import { RouterProvider } from "react-router";
import { BookingProvider } from "./features/booking/BookingContext";
import { router } from "./routes";

function App() {
  return (
    <BookingProvider>
      <RouterProvider router={router} />
    </BookingProvider>
  );
}

export default App;
