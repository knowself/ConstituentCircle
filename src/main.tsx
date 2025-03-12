import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

// Configure authentication to work with profiles table
convex.setAuth(async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) return null;
  
  return {
    // Use profile ID instead of user ID
    payload: {
      profileId: userId,
      email: localStorage.getItem('userEmail'),
      name: localStorage.getItem('userName'),
      role: localStorage.getItem('userRole')
    }
  };
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ConvexProvider>
  </StrictMode>
);