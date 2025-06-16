import './App.css'
import TodoList from "./components/TodoList/TodoList.tsx";
import {BoardProvider} from "./context/BoardContext/BoardContext.tsx";

function App() {

  return (
    <BoardProvider>
     <TodoList/>
    </BoardProvider>
  )
}

export default App
