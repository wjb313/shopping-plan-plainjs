// generate daily subgrids; these act as draggable containers for each day's menu items
for (let i = 0; i < 7; i++) {
  const dailySubGrid = document.createElement("div");
  const subGrid = document.querySelector("#subGrid");

  // constants and variables for dynamic SVG creation
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  //dailySubGrid.setAttribute("draggable", true);
  dailySubGrid.className = "daySubGrid";
  dailySubGrid.id = "dsg" + [i + 1];
  subGrid.appendChild(dailySubGrid);

  for (let j = 0; j < 4; j++) {
    const menuItem = document.createElement("input");
    const currentDSG = document.querySelector("#dsg" + [i + 1]);

    // menuItem.setAttribute("contentEditable", false);
    menuItem.className = "menuItems";
    menuItem.id = "mi" + [j + 1];
    currentDSG.appendChild(menuItem);
    for (let k = 0; k < 1; k++) {
      svg.setAttribute("aria-hidden", "true");
      // svg.setAttribute(
      //   "style",
      //   "-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);"
      // );
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      svg.setAttribute("viewbox", "0 -10 24 24");
      svg.setAttribute("width", "5em");
      svg.setAttribute("height", "5em");
      svg.id = "svg" + [i + 1];
      svg.className.baseVal = "handleSVG";

      path.setAttribute(
        "d",
        "M19 9H5c-.55 0-1 .45-1 1s.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1zM5 15h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1s.45 1 1 1z"
      );
      path.setAttribute("fill", "#626262");

      svg.appendChild(path);
      currentDSG.appendChild(svg);
    }
  }
}
