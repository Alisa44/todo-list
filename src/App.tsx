import './App.css'
import TodoList from "./components/TodoList/TodoList.tsx";
import {BoardProvider} from "./context/BoardContext/BoardContext.tsx";
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {useEffect} from "react";


function App() {
    useEffect(() => {
        return monitorForElements({});
    }, []);

    return (
        <BoardProvider>
            <TodoList/>
        </BoardProvider>
    )
}

export default App
