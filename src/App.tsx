import './App.css'
import Board from "./features/Board/Board.tsx";
import {BoardProvider} from "./context/BoardContext/BoardContext.tsx";
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {useEffect} from "react";


function App() {
    useEffect(() => {
        return monitorForElements({});
    }, []);

    return (
        <BoardProvider>
            <Board/>
        </BoardProvider>
    )
}

export default App
