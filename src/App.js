import "./App.css";
import FileUpload from "./components/FileUpload";
import { NavBar } from "./components/NavBar";
import { FileContextProvider } from "./context/FileContext";

function App() {
  return (
    <div className="App">
      <FileContextProvider>
        <NavBar />
        <FileUpload />
      </FileContextProvider>
    </div>
  );
}

export default App;
