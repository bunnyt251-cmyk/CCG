import React, { useState, useEffect } from "react";

// 🔹 Moved outside so ESLint won't complain
const keyframesCSS = `
  @keyframes bounce { 
    0%, 20%, 50%, 80%, 100% {transform: translateY(0);} 
    40% {transform: translateY(-20px);} 
    60% {transform: translateY(-10px);} 
  }
  @keyframes fadeIn { from {opacity: 0;} to {opacity: 1;} }
  @keyframes spin { from {transform: rotate(0deg);} to {transform: rotate(360deg);} }
  @keyframes pulse { 0% {transform: scale(1);} 50% {transform: scale(1.1);} 100% {transform: scale(1);} }
  @keyframes slideIn { from {transform: translateX(-100%);} to {transform: translateX(0);} }
`;

function App() {
  const [droppedItems, setDroppedItems] = useState([]);
  const [generatedCode, setGeneratedCode] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [canvasBg, setCanvasBg] = useState("#f8f8f8"); // 🔹 Canvas background

  // default styles per component
  const defaultStyles = {
    Button: {
      text: "🚀 Click Me",
      background: "linear-gradient(135deg,#667eea,#764ba2)",
      color: "white",
      fontSize: 16,
      borderRadius: 12,
      padding: "14px 28px",
      animation: "none",
    },
    Input: {
      placeholder: "Type here...",
      background: "#1a1a2e",
      color: "white",
      fontSize: 15,
      width: 180,
      height: 40,
      borderRadius: 8,
      animation: "none",
    },
    Card: {
      title: "✨ Card Title",
      text: "This is a stylish card component.",
      background: "linear-gradient(135deg,#fdfcfb,#e2d1c3)",
      color: "#333",
      width: 220,
      borderRadius: 16,
      padding: 25,
      animation: "none",
    },
    Badge: {
      text: "🔥 Hot Badge",
      background: "linear-gradient(135deg,#ff416c,#ff4b2b)",
      color: "white",
      fontSize: 14,
      borderRadius: 20,
      padding: "8px 18px",
      animation: "none",
    },
  };

  // suggested animations
  const animations = {
    none: "none",
    bounce: "bounce 2s infinite",
    fade: "fadeIn 1.5s ease-in-out",
    rotate: "spin 3s linear infinite",
    pulse: "pulse 2s infinite",
    slide: "slideIn 1s ease-out",
  };

  useEffect(() => {
    // Inject styles in live editor preview (runs once)
    const style = document.createElement("style");
    style.innerHTML = keyframesCSS;
    document.head.appendChild(style);
  }, []);

  function getBaseHTML(items) {
    return `
<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Generated UI</title>
<style>
  body { font-family: Segoe UI, sans-serif; background:${canvasBg}; padding:40px; margin:0; }
  .canvas { position:relative; width:100%; height:100vh; }
  ${keyframesCSS}
</style>
</head><body>
<div class="canvas">
${items
  .map((item) => {
    const s = item.styles;
    const animationCSS = animations[s.animation] || "none";
    const baseStyle = `position:absolute; top:${item.y}px; left:${item.x}px; animation:${animationCSS};`;

    switch (item.type) {
      case "Button":
        return `<button style="${baseStyle}
          background:${s.background};
          color:${s.color};
          border:none;
          border-radius:${s.borderRadius}px;
          padding:${s.padding};
          font-size:${s.fontSize}px;
          cursor:pointer;
        ">${s.text}</button>`;
      case "Input":
        return `<input placeholder="${s.placeholder}" style="${baseStyle}
          background:${s.background};
          color:${s.color};
          border:2px solid #667eea;
          border-radius:${s.borderRadius}px;
          width:${s.width}px;
          height:${s.height}px;
          font-size:${s.fontSize}px;
          padding:8px;
        " />`;
      case "Card":
        return `<div style="${baseStyle}
          background:${s.background};
          color:${s.color};
          width:${s.width}px;
          border-radius:${s.borderRadius}px;
          padding:${s.padding}px;
        ">
          <h3>${s.title}</h3>
          <p>${s.text}</p>
        </div>`;
      case "Badge":
        return `<span style="${baseStyle}
          background:${s.background};
          color:${s.color};
          border-radius:${s.borderRadius}px;
          padding:${s.padding};
          font-size:${s.fontSize}px;
          display:inline-block;
        ">${s.text}</span>`;
      default:
        return "";
    }
  })
  .join("\n")}
</div>
</body></html>`;
  }

  function handleDragStart(e, type) {
    e.dataTransfer.setData("componentType", type);
  }

  function handleDrop(e) {
    e.preventDefault();
    const type = e.dataTransfer.getData("componentType");
    const canvas = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - canvas.left;
    const y = e.clientY - canvas.top;

    const newItem = {
      id: Date.now(),
      type,
      x,
      y,
      styles: { ...defaultStyles[type] },
    };
    const updatedItems = [...droppedItems, newItem];
    setDroppedItems(updatedItems);
    setGeneratedCode(getBaseHTML(updatedItems));
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  // dragging existing item
  function handleItemDrag(e, item) {
    const canvas = e.currentTarget.parentElement.getBoundingClientRect();
    const x = e.clientX - canvas.left;
    const y = e.clientY - canvas.top;
    const updated = droppedItems.map((it) =>
      it.id === item.id ? { ...it, x, y } : it
    );
    setDroppedItems(updated);
    setSelectedItem({ ...item, x, y });
    setGeneratedCode(getBaseHTML(updated));
  }

  function selectItem(item) {
    setSelectedItem(item);
  }

  function updateStyle(key, value) {
    if (!selectedItem) return;
    const updated = droppedItems.map((item) =>
      item.id === selectedItem.id
        ? { ...item, styles: { ...item.styles, [key]: value } }
        : item
    );
    setDroppedItems(updated);
    setSelectedItem({
      ...selectedItem,
      styles: { ...selectedItem.styles, [key]: value },
    });
    setGeneratedCode(getBaseHTML(updated));
  }

  function updatePosition(key, value) {
    if (!selectedItem) return;
    const updated = droppedItems.map((item) =>
      item.id === selectedItem.id ? { ...item, [key]: Number(value) } : item
    );
    setDroppedItems(updated);
    setSelectedItem({ ...selectedItem, [key]: Number(value) });
    setGeneratedCode(getBaseHTML(updated));
  }

  function deleteItem() {
    if (!selectedItem) return;
    const updated = droppedItems.filter((i) => i.id !== selectedItem.id);
    setDroppedItems(updated);
    setSelectedItem(null);
    setGeneratedCode(getBaseHTML(updated));
  }

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Welcome */}
      {showWelcome && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "linear-gradient(135deg,#ff416c,#ff4b2b)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "48px",
            zIndex: 999,
          }}
        >
          ✨ Welcome ✨
        </div>
      )}

      {/* Toolbox */}
      <div
        style={{ width: "220px", background: "#222", color: "white", padding: 20 }}
      >
        <h3 style={{ textAlign: "center" }}>🛠 Toolbox</h3>
        {["Button", "Input", "Card", "Badge"].map((comp) => (
          <div
            key={comp}
            draggable
            onDragStart={(e) => handleDragStart(e, comp)}
            style={{
              background: "#444",
              margin: "10px 0",
              padding: "10px",
              borderRadius: 8,
              textAlign: "center",
              cursor: "grab",
            }}
          >
            {comp}
          </div>
        ))}
      </div>

      {/* Canvas */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          flex: 1,
          position: "relative",
          background: canvasBg,
          margin: 20,
          borderRadius: 12,
        }}
      >
        {droppedItems.map((item) => {
          const s = item.styles;
          return (
            <div
              key={item.id}
              onClick={() => selectItem(item)}
              draggable
              onDragEnd={(e) => handleItemDrag(e, item)}
              style={{
                position: "absolute",
                top: item.y,
                left: item.x,
                cursor: "move",
                border: selectedItem?.id === item.id ? "2px solid red" : "none",
                animation: animations[s.animation] || "none",
              }}
            >
              {item.type === "Button" && (
                <button
                  style={{
                    background: s.background,
                    color: s.color,
                    borderRadius: `${s.borderRadius}px`,
                    fontSize: `${s.fontSize}px`,
                    padding: s.padding,
                    border: "none",
                    cursor: "pointer",
                    animation: animations[s.animation] || "none",
                  }}
                >
                  {s.text}
                </button>
              )}
              {item.type === "Input" && (
                <input
                  placeholder={s.placeholder}
                  style={{
                    background: s.background,
                    color: s.color,
                    borderRadius: `${s.borderRadius}px`,
                    fontSize: `${s.fontSize}px`,
                    width: `${s.width}px`,
                    height: `${s.height}px`,
                    padding: 8,
                    border: "2px solid #667eea",
                    animation: animations[s.animation] || "none",
                  }}
                />
              )}
              {item.type === "Card" && (
                <div
                  style={{
                    background: s.background,
                    color: s.color,
                    width: `${s.width}px`,
                    borderRadius: `${s.borderRadius}px`,
                    padding: `${s.padding}px`,
                    animation: animations[s.animation] || "none",
                  }}
                >
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              )}
              {item.type === "Badge" && (
                <span
                  style={{
                    background: s.background,
                    color: s.color,
                    borderRadius: `${s.borderRadius}px`,
                    fontSize: `${s.fontSize}px`,
                    padding: s.padding,
                    display: "inline-block",
                    animation: animations[s.animation] || "none",
                  }}
                >
                  {s.text}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Properties Panel */}
      <div
        style={{
          width: "300px",
          background: "#121212",
          color: "white",
          padding: 20,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3>⚙ Properties</h3>
        {selectedItem ? (
          <div style={{ flex: 1, overflowY: "auto" }}>
            {/* Position controls */}
            <div style={{ marginBottom: 10 }}>
              <label>X Position: </label>
              <input
                type="number"
                value={selectedItem.x}
                onChange={(e) => updatePosition("x", e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Y Position: </label>
              <input
                type="number"
                value={selectedItem.y}
                onChange={(e) => updatePosition("y", e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            {/* Style controls */}
            {Object.keys(selectedItem.styles).map((key) => (
              <div key={key} style={{ marginBottom: 10 }}>
                <label>{key}: </label>
                <input
                  type="text"
                  value={selectedItem.styles[key]}
                  onChange={(e) => updateStyle(key, e.target.value)}
                  style={{ width: "100%", padding: "4px", marginTop: "4px" }}
                />
              </div>
            ))}

            {/* Animation selector */}
            <div style={{ marginBottom: 10 }}>
              <label>Animation: </label>
              <select
                value={selectedItem.styles.animation}
                onChange={(e) => updateStyle("animation", e.target.value)}
                style={{ width: "100%", padding: "6px" }}
              >
                {Object.keys(animations).map((anim) => (
                  <option key={anim} value={anim}>
                    {anim}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={deleteItem}
              style={{
                marginTop: 10,
                background: "red",
                color: "white",
                padding: "8px 12px",
                border: "none",
                cursor: "pointer",
                width: "100%",
              }}
            >
              🗑 Delete
            </button>
          </div>
        ) : (
          <p>No component selected</p>
        )}

        {/* Canvas background */}
        <h3 style={{ marginTop: 20 }}>🎨 Canvas Background</h3>
        <input
          type="text"
          value={canvasBg}
          onChange={(e) => setCanvasBg(e.target.value)}
          placeholder="e.g., #fff or linear-gradient(...)"
          style={{ width: "100%", padding: "6px", marginTop: "6px" }}
        />

        {/* Generated Code */}
        <h3 style={{ marginTop: 20 }}>📜 Generated Code</h3>
        <pre
          style={{
            fontSize: 10,
            background: "#000",
            padding: 10,
            overflow: "auto",
            maxHeight: "30vh",
          }}
        >
          {generatedCode}
        </pre>
        <button
          onClick={() => navigator.clipboard.writeText(generatedCode)}
          style={{
            marginTop: 10,
            padding: "10px 16px",
            background: "linear-gradient(135deg,#00c6ff,#0072ff)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          📋 Copy Full Code
        </button>
      </div>
    </div>
  );
}

export default App;
