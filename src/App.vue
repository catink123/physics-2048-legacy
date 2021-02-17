<template>
  <div id="app">
    <div class="container">
      <p>Очки: {{ score }}</p>

      <p v-if="lastCreatedTile !== null" style="margin-left: 5px">
        Последняя новая плитка: {{ lastCreatedTile }}
      </p>
    </div>
    <div class="container">
      <!-- <canvas id="imageLayer" width="376" height="376" /> -->
      <canvas id="c" width="305" height="305" />
    </div>
    <div class="rules" v-if="!rulesRead">
      <div class="container">
        <p>
          Правила игры:<br />
          Существует поле 5х5, на котором появляются плитки с величинами, выглядящие по-разному (величина, обозначение, предмет, ассоцииоранный с этой величиной). <br />
          Соединяя эти плитки, можно получить новую плитку, которая является
          новой величиной или её частью. <br />
          При нажатии стрелок на клавиатуре или кнопок управления на экране, <br />
          происходит сдвиг всех плиток в выбранную сторону и все возможные
          соединения выполняются. <br />
          После каждого сдвига появляется новая случайная величина, которая будет подсвечена красным. <br />
        </p>

        <button style="padding: 5px" @click="rulesRead = true">
          Начать игру
        </button>
      </div>
    </div>
    <div class="container">
      <button @click="reset" style="margin-top: 2px">Начать заново</button>
    </div>
    <!-- <p>Используйте стрелки клавиатуры или кнопки ниже для управления.</p> -->
    <div class="container">
      <table>
        <tr>
          <td></td>
          <td><button @click="move('up')">▲</button></td>
          <td></td>
        </tr>
        <tr>
          <td><button @click="move('left')">◀</button></td>
          <td></td>
          <td><button @click="move('right')">▶</button></td>
        </tr>
        <tr>
          <td></td>
          <td><button @click="move('down')">▼</button></td>
          <td></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import data from "./data";
import images from "./images";
import Tile from "./components/Tile";

export default {
  name: "App",
  data: function () {
    return {
      grid: [],
      knownTiles: [],
      lastCreatedTile: null,
      score: 0,
      rulesRead: false,
      ctx: null
    };
  },
  beforeMount() {
    var grid = [];
    for (let x = 0; x < 4; x++) {
      var row = [];
      for (let y = 0; y < 4; y++) { 
        row.push(new Tile("", ""));
      }
      grid.push(row);
    }
    this.grid = grid;
    this.knownTiles = data.startingTiles;
    this.putRandomNumber();
    this.putRandomNumber();

    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          this.move("left");
          break;
        case "ArrowUp":
          e.preventDefault();
          this.move("up");
          break;
        case "ArrowRight":
          e.preventDefault();
          this.move("right");
          break;
        case "ArrowDown":
          e.preventDefault();
          this.move("down");
          break;

        default:
          break;
      }
    });
  },
  methods: {
    newGrid() {
      var grid = [];
      for (let x = 0; x < 4; x++) {
        var row = [];
        for (let y = 0; y < 4; y++) {
          row.push(new Tile("", ""));
        }
        grid.push(row);
      }
      return grid;
    },

    putRandomNumber() {
      var arr = this.grid;
      var emptySpaces = [];
      for (let y in arr) {
        for (let x in arr[y]) {
          if (arr[y][x].value === "") {
            emptySpaces.push([parseInt(y), parseInt(x)]);
          }
        }
      }
      var index = emptySpaces[Math.floor(Math.random() * emptySpaces.length)];
      var number = this.knownTiles[
        Math.random() * 1 > 0.9 ? 1 : 0
      ];
      arr[index[0]][index[1]].value = number;
      arr[index[0]][index[1]].isNewTile = true;
      var display = data.appearance.display[number];
      if (display) {
        arr[index[0]][index[1]].display = display[Math.round(Math.random() * (display.length - 1))];
      } else {
        arr[index[0]][index[1]].display = number;
      }
      this.grid = arr;
    },

    slideRow(row) {
      var arr = row.filter((val) => {
        if (val.value !== "") {
          return true;
        } else {
          return false;
        }
      });
      var zeroes = [];
      for (var i = 0; i < (4 - arr.length); i++) {
        zeroes[i] = new Tile("", "");
      }
      arr = zeroes.concat(arr);
      return arr;
    },

    combineRow(row) {
      var arr = row;
      for (let i = 3; i >= 1; i--) {
        let a = arr[i].value;
        let b = arr[i - 1].value;
        let result;
        if ({}.hasOwnProperty.call(data.combinations, `${a} ${b}`)) {
          result = data.combinations[`${a} ${b}`];
        } else if ({}.hasOwnProperty.call(data.combinations, `${b} ${a}`)) {
          result = data.combinations[`${b} ${a}`];
        }
        if (result !== undefined) {
          var appearance = data.appearance.display[result];
          arr[i].value = result;
          if (appearance !== undefined) arr[i].display = appearance[Math.floor(Math.random() * appearance.length)];
          else arr[i].display = result;
          arr[i - 1].value = "";
          arr[i - 1].display = "";
          if (!this.knownTiles.includes(result)) {
            this.knownTiles.push(result);
            this.lastCreatedTile = result;
          }
          var scoreEarned = Math.pow(2, this.knownTiles.findIndex(val => val === result) + 1);
          this.score += scoreEarned;
        }
      }
      return arr;
    },

    operate(row, direction) {
      var arr = row;
      arr = this.slideRow(arr, direction);
      arr = this.combineRow(arr);
      arr = this.slideRow(arr, direction);
      return arr;
    },

    copyGrid(grid) {
      let extra = this.newGrid();
      for (let i in grid) {
        for (let j in grid) {
          extra[i][j] = grid[i][j];
        }
      }
      return extra;
    },

    compareGrid(firstGrid, secondGrid) {
      for (let i in firstGrid) {
        for (let j in firstGrid) {
          if (firstGrid[i][j].value !== secondGrid[i][j].value) return false;
        }
      }
      return true;
    },

    flipGrid(grid) {
      let newGrid = grid;
      for (let i in newGrid) {
        newGrid[i].reverse();
      }
      return newGrid;
    },

    transposeGrid(grid, direction) {
      let newGrid = this.newGrid();
      for (let i in grid) {
        for (let j in grid) {
          if (direction === 1) {
            newGrid[i][j].value = grid[j][i].value;
            newGrid[i][j].display = grid[j][i].display;
          } else if (direction === -1) {
            newGrid[j][i].value = grid[i][j].value;
            newGrid[j][i].display = grid[i][j].display;
          }
        }
      }
      return newGrid;
    },

    updateCanvas() {
      var context = this;
      var canv = document.querySelector("#c");
      var c = canv.getContext("2d");
      this.ctx = c;
      c.filter = "";
      const rectW = 75;
      const rectH = 75;
      const grid = context.$data.grid;
      c.clearRect(0, 0, canv.width, canv.height);
      for (let i in grid) {
        for (let j in grid) {
          if (grid[i][j].isNewTile === true) {
            c.strokeStyle = "red";
            c.lineWidth = 6;
          }
          else {
            c.strokeStyle = "black";
            c.lineWidth = 2;
            c.filter = "";
          }
          c.strokeRect(j * rectW + 5, i * rectH + 5, rectW - 5, rectH - 5);
          c.filter = "";
          grid[i][j].isNewTile = false;
          let bgColor;
          var fontColor = data.appearance.fontColor[grid[i][j].value];
          if (
            grid[i][j].value != "" &&
            grid[i][j].display.search("img") === -1
          ) {
            bgColor = data.appearance.color[grid[i][j].value];
            var fontSize = data.fontSizes[grid[i][j].display.length - 1];
            // Background color
            if (fontSize !== undefined) {
              c.font = fontSize + "px italic";
            } else {
              c.font = "64px italic";
            }

            c.fillStyle = bgColor !== undefined ? bgColor : "black";
            c.fillRect(j * rectW + 5, i * rectH + 5, rectW - 5, rectH - 5);
            // Font color
            if (fontColor !== undefined) {
              c.fillStyle = fontColor;
            } else {
              c.fillStyle = "white";
            }
            c.textAlign = "center";
            c.textBaseline = "middle";
            c.fillText(
              grid[i][j].display,
              j * rectW + rectW / 2 + 2.5,
              i * rectH + rectH / 2 + 2.5
            );
          } else if (grid[i][j].display.search("img") !== -1) {
            bgColor = data.appearance.color[grid[i][j].value];
            c.fillStyle = bgColor !== undefined ? bgColor : "black";
            c.fillRect(j * rectW + 5, i * rectH + 5, rectW - 5, rectH - 5); 
            var args = grid[i][j].display.split(" ");
            var image = new Image();
            image.onload = function() {
              if (data.appearance.fontColor[grid[i][j].value] !== "black") c.filter = "invert(1)";
              c.drawImage(this, j * rectW + 5, i * rectH + 5);
              c.filter = "invert(0)";
            };
            image.src = images[args[1]];
          }
        }
      }
      // requestAnimationFrame(this.updateCanvas)
    },

    isGameOver() {
      let grid = this.grid;
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (grid[i][j] == "") {
            return false;
          }

          /* if (i !== 3 && grid[i][j] === grid[i + 1][j]) {
            return false;
          }

          if (j !== 3 && grid[i][j] === grid[i][j + 1]) {
            return false;
          } */

          if (i !== 3 && data.combinations[`${grid[i][j]} ${grid[i + 1][j]}`]) {
            return false;
          }

          if (j !== 3 && grid[i][j] === grid[i][j + 1]) {
            return false;
          }
        }
      }
      return true;
    },

    move(direction) {
      var pastGrid = this.copyGrid(this.grid);
      var row;
      let flipped = false;
      let rotated = false;

      switch (direction) {
        case "left":
          this.grid = this.flipGrid(this.grid);
          flipped = true;
          break;
        case "right":
          // Do nothing
          break;
        case "up":
          this.grid = this.transposeGrid(this.grid, 1);
          this.grid = this.flipGrid(this.grid);
          rotated = true;
          flipped = true;
          break;
        case "down":
          this.grid = this.transposeGrid(this.grid, 1);
          rotated = true;
          break;

        default:
          break;
      }

      for (row in this.grid) {
        this.grid[row] = this.slideRow(this.grid[row]);
        this.grid[row] = this.combineRow(this.grid[row]);
        this.grid[row] = this.slideRow(this.grid[row]);
      }

      if (flipped) this.grid = this.flipGrid(this.grid);
      if (rotated) {
        this.grid = this.transposeGrid(this.grid, -1);
        rotated = false;
      }

      if (!this.compareGrid(pastGrid, this.grid)) {
        this.putRandomNumber();
      }

      this.updateCanvas();

      // let gameOver = this.isGameOver();
      // if (gameOver) console.log("GAME OVER");
    },

    reset() {
      this.grid = this.newGrid();
      this.lastCreatedTile = null;
      this.knownTiles = data.startingTiles;
      this.score = 0;
      this.putRandomNumber();
      this.putRandomNumber();
      this.updateCanvas();
    },
  },

  mounted() {
    this.updateCanvas();
  },
};
</script>

<style>
body {
  margin: 0;
}

div.rules {
  position: absolute;
  background: white;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

div.rules .container {
  display: block;
}

p {
  margin: 5px 0;
}

div.grid {
  display: grid;
  grid-template-columns: 100px 100px 100px 100px;
  grid-template-rows: 100px 100px 100px 100px;
  gap: 10px;
}

div.cell {
  border: 1px solid black;
  border-radius: 5px;
  overflow: hidden;
}

div.cell div.value {
  font-size: 32px;
  user-select: none;
  color: white;
  background: black;
  height: 100%;
}

div.value p {
  margin: 0;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  justify-items: center;
  justify-content: center;
  height: 100vh;
  margin: 0;
}

div.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

table button {
  width: 75px;
  height: 75px;
  font-size: 50px;
  border: 1px solid black;
  outline: none;
  border-radius: 10px;
  background: rgb(220, 220, 220);
  color: rgb(50, 50, 50);
  transition-duration: .1s;
  transition-property: all;
  user-select: none;
}

table button:hover {
  background: rgb(240, 240, 240)
}

table button:active {
  background: rgb(100, 100, 100);
  color: white;
  transform: scale(0.95)
}
</style>
