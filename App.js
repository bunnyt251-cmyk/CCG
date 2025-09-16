function App() {
  function handleClick() {
    alert("Hello! You clicked the button 🚀");
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to My React App 🎉</h1>
      <button onClick={handleClick}>Click Me</button>
    </div>
  );
}

export default App;
