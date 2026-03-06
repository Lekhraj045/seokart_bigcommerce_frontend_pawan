import { createContext } from "react";

// 1. Define your context type
interface GlobalContextType {
  userStatus: string;
  trialDays: number
}

// 2. Create the context with that type
export const GlobalContext = createContext<GlobalContextType>({
  userStatus: "free", trialDays: 10
});
