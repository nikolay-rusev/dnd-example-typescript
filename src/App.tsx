import DragNDrop from "./components/DragNDrop";
import "./App.css";

// elements for drag & drop
const itemsArray: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function App() {
    return (
        <div className="App">
            <DragNDrop
                topHandle={true}
                scrollAfterDrag={true}
                restoreScroll={true}
                randomizeHeight={true}
                itemsArray={itemsArray}
            />
        </div>
    );
}

export default App;
