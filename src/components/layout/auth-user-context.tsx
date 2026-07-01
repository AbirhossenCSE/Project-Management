import { createContext, useContext, type ReactNode } from "react";

import type { AuthUser } from "@/services/auth.service";

type AuthUserContextValue = {
    user: AuthUser | null;
    setUser: (user: AuthUser | null) => void;
};

const AuthUserContext = createContext<AuthUserContextValue | undefined>(undefined);

export function AuthUserProvider({
    user,
    setUser,
    children,
}: {
    user: AuthUser | null;
    setUser: (user: AuthUser | null) => void;
    children: ReactNode;
}) {
    return <AuthUserContext.Provider value={{ user, setUser }}>{children}</AuthUserContext.Provider>;
}

export function useAuthUser() {
    const context = useContext(AuthUserContext);

    if (!context) {
        throw new Error("useAuthUser must be used within an AuthUserProvider");
    }

    return context;
}
