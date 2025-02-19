import { createContext, useContext, useState } from "@wordpress/element"

type NavigationActionContextType = {
  edit: () => void
}

const NavigationStateContext = createContext({})
const NavigationActionContext = createContext({} as NavigationActionContextType)

export const NavigationContextProvider = ({ children }) => {
  const [state, setState] = useState({})

  return (
    <NavigationStateContext.Provider value={{ ...state }}>
      <NavigationActionContext.Provider value={{}}>
        {children}
      </NavigationActionContext.Provider>
    </NavigationStateContext.Provider>
  )
}

export const useNavigationState = () => useContext(NavigationStateContext)

export const useNavigationAction = () => useContext(NavigationActionContext)
