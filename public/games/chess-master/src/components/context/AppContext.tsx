import { createContext, useContext, useReducer } from "react";
import { AppContextProps, AppProviderValue } from "../../Data/interfaces";
import initialState from "../../Data/initialState";
import { reducer } from "../../Reducer/reducer";

const appContext = createContext<AppProviderValue>({
  appState: initialState,
  dispatch: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  return useContext(appContext);
};

const AppContext = ({ children }: AppContextProps) => {
  const [appState, dispatch] = useReducer(reducer, initialState);
  const appProvider = { appState, dispatch };

  return (
    <appContext.Provider value={appProvider}>{children}</appContext.Provider>
  );
};

export default AppContext;
