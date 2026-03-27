import { createContext, useContext } from 'react';

// Mock User Data
const MOCK_USER = {
    id: "user_mock123",
    fullName: "Dr. Alex Carter",
    firstName: "Dr.",
    lastName: "Carter",
    primaryEmailAddress: { emailAddress: "alex.carter@medicalmagic.ai" },
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
};

// Mock Context
const AuthContext = createContext({
    isLoaded: true,
    isSignedIn: true,
    user: MOCK_USER,
    signOut: async () => { },
    signIn: async () => { },
});

export const useUser = () => useContext(AuthContext);
export const useAuth = () => useContext(AuthContext);

// Mock ClerkProvider
export const ClerkProvider = ({ children }: { children: React.ReactNode, publishableKey?: string }) => {
    return (
        <AuthContext.Provider value={{
            isLoaded: true,
            isSignedIn: true, // Always signed in
            user: MOCK_USER,
            signOut: async () => console.log("Mock Sign Out"),
            signIn: async () => console.log("Mock Sign In"),
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Mock SignedIn Component - Renders children if signed in (Always true in mock)
export const SignedIn = ({ children }: { children: React.ReactNode }) => {
    const { isSignedIn } = useAuth();
    return isSignedIn ? <>{children}</> : null;
};

// Mock SignedOut Component - Renders children if signed out (Always false in mock)
export const SignedOut = ({ children }: { children: React.ReactNode }) => {
    const { isSignedIn } = useAuth();
    return !isSignedIn ? <>{children}</> : null;
};

// Mock RedirectToSignIn - Since we are always signed in, this shouldn't technically render, 
// strictly speaking it would redirect. For mock, we can just render null or a message.
export const RedirectToSignIn = () => {
    return null; // Or <Navigate to="/dashboard" /> if we want to force entry
};
