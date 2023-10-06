import "./App.css";
import FileUpload from "./components/FileUpload";
import { FileContextProvider } from "./context/FileContext";

function App() {
  return (
    <div className="App">
      <FileContextProvider>
        <FileUpload />
      </FileContextProvider>
    </div>
  );
}

export default App;
