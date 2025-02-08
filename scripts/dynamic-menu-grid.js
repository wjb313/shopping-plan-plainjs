// ***MODERNIZED DYNAMIC MENU GRID***

document.addEventListener("DOMContentLoaded", () => {
  const subGrid = document.querySelector("#subGrid");
  
  for (let i = 0; i < 7; i++) {
      const dailySubGrid = document.createElement("div");
      dailySubGrid.className = "daySubGrid";
      dailySubGrid.id = `dsg${i + 1}`;
      subGrid.appendChild(dailySubGrid);

      for (let j = 0; j < 4; j++) {
          const menuItem = document.createElement("input");
          menuItem.className = "menuItems";
          menuItem.id = `mi${i + 1}-${j + 1}`;
          dailySubGrid.appendChild(menuItem);
      }

      // SVG Icon Creation
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      svg.setAttribute("viewBox", "0 -10 24 24");
      svg.setAttribute("width", "5em");
      svg.setAttribute("height", "5em");
      svg.id = `svg${i + 1}`;
      svg.classList.add("handleSVG");
      
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "M19 9H5c-.55 0-1 .45-1 1s.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1zM5 15h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1s.45 1 1 1z");
      path.setAttribute("fill", "#626262");
      
      svg.appendChild(path);
      dailySubGrid.appendChild(svg);
  }
});
