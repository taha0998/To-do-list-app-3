import TodoApp from "./pages/TodoApp";
import Auth from "./pages/Auth";
import { useCookies } from "react-cookie";

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  return (
    <div className="app">
      {!cookies.AuthToken && <Auth />}
      {cookies.AuthToken && <TodoApp />}
    </div>
  );
};

export default App;
