<template>
  <div id="app">
    <div class="container">
      <canvas id="c" width="401" height="401" />
    </div>
    <p>Используйте стрелки клавиатуры или кнопки ниже для управления.</p>
    <div class="container">
      <table>
        <tr>
          <td></td>
          <td><button @click="move('up')">Вверх</button></td>
          <td></td>
        </tr>
        <tr>
          <td><button @click="move('left')">Влево</button></td>
          <td></td>
          <td><button @click="move('right')">Вправо</button></td>
        </tr>
        <tr>
          <td></td>
          <td><button @click="move('down')">Вниз</button></td>
          <td></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import data from "./data";

export default {
  name: "App",
  data: function () {
    return {
      grid: [
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
      ],
    };
  },
  computed: {
    arrayForGrid() {
      var returnList = [];
      returnList = returnList.concat(this.grid[0]);
      returnList = returnList.concat(this.grid[1]);
      returnList = returnList.concat(this.grid[2]);
      returnList = returnList.concat(this.grid[3]);
      for (let i in returnList) {
        returnList[i] = {
          key: i,
          value: returnList[i],
        };
      }
      return returnList;
    },

    valueGrid(grid) {
      var valueGrid;
      for (let row in grid) {
        var currentRow = [];
        for (let cell in row) {
          currentRow.push(cell.value);
        }
        valueGrid.push(currentRow);
      }
      return valueGrid;
    },
  },
  beforeMount() {
    var grid = [];
    for (let x = 0; x < 4; x++) {
      var row = [];
      for (let y = 0; y < 4; y++) {
        row.push("");
      }
      grid.push(row);
    }
    this.grid = grid;
    this.putRandomNumber();
    this.putRandomNumber();

    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowLeft":
          this.move("left");
          break;
        case "ArrowUp":
          this.move("up");
          break;
        case "ArrowRight":
          this.move("right");
          break;
        case "ArrowDown":
          this.move("down");
          break;

        default:
          break;
      }
    });
  },
  methods: {
    putRandomNumber() {
      var arr = this.grid;
      var emptySpaces = [];
      for (let y in arr) {
        for (let x in arr) {
          if (arr[y][x] == "") {
            emptySpaces.push([parseInt(y), parseInt(x)]);
          }
        }
      }

      var index = emptySpaces[Math.floor(Math.random() * emptySpaces.length)];
      var number = data.startingTiles[Math.floor(Math.random() * data.startingTiles.length)];
      arr[index[0]][index[1]] = number;
      this.grid = arr;
    },

    slideRow(row) {
      var arr = row.filter((val) => {
        if (val !== "") {
          return true;
        } else {
          return false;
        }
      });
      var zeroes = Array(4 - arr.length).fill("");
      arr = zeroes.concat(arr);
      return arr;
    },

    combineRow(row) {
      var arr = row;
      for (let i = 3; i >= 1; i--) {
        let a = arr[i];
        let b = arr[i - 1];
        let possibleWith;
        if (data.combinations[a] !== undefined) {
          possibleWith = data.combinations[a].find((val) => {
            if (val.with == b) return true;
            else return false;
          });
        }
        if (possibleWith !== undefined) {
          arr[i] = possibleWith.result;
          arr[i - 1] = "";
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
      let extra = [
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
      ];
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
          if (firstGrid[i][j] == secondGrid[i][j]) return false;
          else return true;
        }
      }
    },

    flipGrid(grid) {
      let newGrid = grid;
      for (let i in newGrid) {
        newGrid[i].reverse();
      }
      return newGrid;
    },

    rotateGrid(grid) {
      let newGrid = [
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
      ];
      for (let i in grid) {
        for (let j in grid) {
          newGrid[i][j] = grid[j][i];
        }
      }
      return newGrid;
    },

    updateCanvas() {
      var context = this;
      var canv = document.querySelector("#c");
      var c = canv.getContext("2d");
      const rectW = 100;
      const rectH = 100;
      const grid = context.$data.grid;
      c.clearRect(0, 0, canv.width, canv.height);
      for (let i in grid) {
        for (let j in grid) {
          c.strokeRect(j * rectW + 5, i * rectH + 5, 95, 95);
          if (grid[i][j] != "") {
            var appearanceData = data.appearance[grid[i][j]];
            var fontSize = data.fontSizes[grid[i][j].length - 1];
            var fontSizeFromAppearance = appearanceData.fontSize;
            // Background color
            if (appearanceData) {
              c.fillStyle = appearanceData.color ? appearanceData.color : "black";
              if (fontSizeFromAppearance !== undefined) {
                c.font = fontSizeFromAppearance + "px sans";
              } else if (fontSize !== undefined) {
                c.font = fontSize + "px sans";
              } else {
                c.font = "64px sans";
              }
              // c.font = fontSizeFromAppearance != undefined ? fontSizeFromAppearance + "px sans" : fontSize != undefined ? fontSize : "64px sans";
            } else {
              c.fillStyle = "black";
              c.font = "64px sans";
            }
            c.fillRect(j * rectW + 5, i * rectH + 5, 95, 95);
            // Font color
            if (appearanceData) {
              c.fillStyle = appearanceData.fontColor ? appearanceData.fontColor : "white";
            } else {
              c.fillStyle = "white";
            }
            c.textAlign = "center";
            c.textBaseline = "middle";
            c.fillText(
              grid[i][j],
              j * rectW + rectW / 2 + 2.5,
              i * rectH + rectH / 2 + 2.5
            );
          }
        }
      }
    },

    isGameOver() {
      let grid = this.grid;
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (grid[i][j] == "") {
            return false;
          }

          if (i !== 3 && grid[i][j] === grid[i + 1][j]) {
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
          this.grid = this.rotateGrid(this.grid);
          this.grid = this.flipGrid(this.grid);
          rotated = true;
          flipped = true;
          break;
        case "down":
          this.grid = this.rotateGrid(this.grid);
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
        // for (let i = 0; i < 3; i++) {
        this.grid = this.rotateGrid(this.grid);
        // }
        rotated = false;
      }

      if (this.compareGrid(pastGrid, this.grid)) {
        this.putRandomNumber();
      }

      this.updateCanvas();

      let gameOver = this.isGameOver();
      if (gameOver) console.log("GAME OVER");
    },
  },

  mounted() {
    this.updateCanvas();
  },
};
</script>

<style>
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
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  justify-items: center;
}

div.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

table button {
  width: 75px;
  height: 75px;
}
</style>
