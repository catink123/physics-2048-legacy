<template>
  <div
    :class="'theme-' + currentTheme"
    id="app"
    :style="
      currentBG !== null
        ? 'background: url(' + bgs[currentBG].image + ')'
        : null
    "
  >
    <div class="container">
      <p :class="'theme-' + currentTheme">Очки: {{ score }}</p>

      <p :class="'theme-' + currentTheme" v-if="lastCreatedTile !== null">
        Последняя новая плитка: {{ lastCreatedTile }}
      </p>
    </div>
    <div class="container">
      <canvas
        :class="'theme-' + currentTheme"
        id="c"
        width="305"
        height="305"
      />

      <transition name="fade">
        <div
          :class="'theme-' + currentTheme"
          class="container gameOver"
          v-if="gameOver"
        >
          <p>Игра окончена!</p>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="menu" :class="'theme-' + currentTheme" v-if="!menuClosed">
        <p style="font-size: 48px">Физический 2048</p>

        <button :class="'theme-' + currentTheme" @click="menuClosed = true">
          Играть
        </button>
        <button :class="'theme-' + currentTheme" @click="rulesOpen = true">
          Правила
        </button>
        <transition name="fade">
          <div class="menu" :class="'theme-' + currentTheme" v-if="rulesOpen">
            <h1>Правила игры</h1>
            <p>
              Существует поле 4х4, на котором появляются плитки с величинами,
              выглядящие по-разному (величина, обозначение, предмет,
              ассоцииоранный с этой величиной). <br />
              Соединяя эти плитки, можно получить новую плитку, которая является
              новой величиной. <br />
              При нажатии стрелок на клавиатуре, кнопок управления на экране (по
              умолчанию отключены, включаются в настройках) или свайпов по полю,
              <br />
              происходит сдвиг всех плиток в выбранную сторону и все возможные
              соединения выполняются. <br />
              После каждого сдвига появляется новая случайная величина, которая
              будет подсвечена красным. <br />
              Существует возможность откатить на одну позицию назад кнопкой
              "Отменить ход". <br />
            </p>
            <button :class="'theme-' + currentTheme" @click="rulesOpen = false">
              Назад
            </button>
          </div>
        </transition>
        <button :class="'theme-' + currentTheme" @click="settingsOpen = true">
          Настройки
        </button>
        <transition name="fade">
          <div
            class="menu"
            :class="'theme-' + currentTheme"
            v-if="settingsOpen"
          >
            <h1>Настройки</h1>
            <!-- <label> Цвет 1: <input type="color" @change="onColor1Changed"> </label>
            <label> Фон: <input type="color" @change="onBgColorChanged"> </label> -->
            <label
              >Тема:
              <select :class="'theme-' + currentTheme" @change="onThemeChanged">
                <!-- <option value="default">Обычная</option>
              <option value="night">Ночная</option> -->
                <option
                  :value="theme.value"
                  v-for="theme in themeList"
                  :key="theme.name"
                  :selected="currentTheme === theme.value ? 'selected' : null"
                >
                  {{ theme.name }}
                </option>
              </select></label
            >
            <label
              >Фон:
              <select :class="'theme-' + currentTheme" @change="onBGChanged">
                <!-- <option value="default">Обычная</option>
              <option value="night">Ночная</option> -->
                <option
                  :value="bg.value"
                  v-for="bg in bgList"
                  :key="bg.name"
                  :selected="currentBG === bg.value ? 'selected' : null"
                >
                  {{ bg.name }}
                </option>
              </select>
            </label>
            <label
              >Кнопки управления:
              <input
                type="checkbox"
                @change="onCtrlsShownChanged"
                :checked="controlsShown"
            /></label>
            <button
              :class="'theme-' + currentTheme"
              @click="settingsOpen = false"
            >
              Назад
            </button>
          </div>
        </transition>
      </div>
    </transition>
    <div class="container controls">
      <button :class="'theme-' + currentTheme" @click="reset">
        Начать заново
      </button>
      <button
        :class="'theme-' + currentTheme"
        @click="undo"
        :disabled="undoUsed"
      >
        Отменить ход
      </button>
      <button :class="'theme-' + currentTheme" @click="menuClosed = false">
        Меню
      </button>
    </div>
    <div class="container" v-if="controlsShown">
      <table>
        <tr>
          <td></td>
          <td>
            <button :class="'theme-' + currentTheme" @click="move('up')">
              ▲
            </button>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>
            <button :class="'theme-' + currentTheme" @click="move('left')">
              ◀
            </button>
          </td>
          <td></td>
          <td>
            <button :class="'theme-' + currentTheme" @click="move('right')">
              ▶
            </button>
          </td>
        </tr>
        <tr>
          <td></td>
          <td>
            <button :class="'theme-' + currentTheme" @click="move('down')">
              ▼
            </button>
          </td>
          <td></td>
        </tr>
      </table>
    </div>
    <div class="authbox">
      <button :class="'theme-' + currentTheme" :disabled="loginPending" @click="login" v-if="!loggedIn">
        Войти
      </button>
      <div v-else>
        <button
          :class="'theme-' + currentTheme"
          @click="logout"
        >
          Выйти
        </button>
        <p>{{ displayName }}</p>
        <img :src="photo" />
      </div>
    </div>
  </div>
</template>

<script>
import SwipeListener from "swipe-listener";
import firebase from "firebase/app";
import "firebase/auth";

import data from "./data";
import images from "./images";
import Tile from "./components/Tile";
import themes from "./themes";
import bgs from "./bgs";

export default {
  name: "App",
  data: function () {
    return {
      grid: [],
      previousGrid: [],
      undoUsed: true,
      knownTiles: [],
      lastCreatedTile: null,
      score: 0,
      ctx: null,

      // Menu bools
      menuClosed: false,
      rulesOpen: false,
      settingsOpen: false,

      // Customisation
      currentTheme: "default",
      currentBG: null,
      controlsShown: false,

      // Auth
      loggedIn: false,
      loginPending: true,
      displayName: "",
      photo: "",

      // Debug
      devFail: false,
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
        case "F1":
          e.preventDefault();
          this.devFail = !this.devFail;
          break;

        default:
          break;
      }
    });
  },
  computed: {
    gameOver() {
      return this.devFail ? true : this.isGameOver();
    },

    themes() {
      return themes;
    },

    themeList() {
      var list = [];
      for (var theme in themes) {
        list.push({
          name: themes[theme].name,
          value: theme,
        });
      }
      return list;
    },

    bgs() {
      return bgs;
    },

    bgList() {
      var list = [];
      for (var bg in bgs) {
        list.push({
          name: bgs[bg].name,
          value: bg,
        });
      }
      return list;
    },
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
      var number = this.knownTiles[Math.random() * 1 > 0.9 ? 1 : 0];
      arr[index[0]][index[1]].value = number;
      arr[index[0]][index[1]].isNewTile = true;
      var display = data.appearance.display[number];
      if (display) {
        arr[index[0]][index[1]].display =
          display[Math.round(Math.random() * (display.length - 1))];
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
      for (var i = 0; i < 4 - arr.length; i++) {
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
          if (appearance !== undefined)
            arr[i].display =
              appearance[Math.floor(Math.random() * appearance.length)];
          else arr[i].display = result;
          arr[i - 1].value = "";
          arr[i - 1].display = "";
          if (!this.knownTiles.includes(result)) {
            this.knownTiles.push(result);
            this.lastCreatedTile = data.appearance.display[result][0];
          }
          var scoreEarned = Math.pow(
            2,
            this.knownTiles.findIndex((val) => val === result) + 1
          );
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
      let theme = themes[this.currentTheme].gridColors;

      for (let i in grid) {
        for (let j in grid) {
          // Border
          if (grid[i][j].isNewTile === true) {
            if (theme.newTile !== undefined) c.strokeStyle = theme.newTile;
            else c.strokeStyle = "red";
            c.lineWidth = 6;
          } else {
            if (theme.tileBorder !== undefined)
              c.strokeStyle = theme.tileBorder;
            else c.strokeStyle = "black";
            c.lineWidth = 2;
            c.filter = "";
          }
          c.strokeRect(j * rectW + 5, i * rectH + 5, rectW - 5, rectH - 5);
          c.filter = "";
          grid[i][j].isNewTile = false;

          // Fill and text/image
          let tileTheme;
          let bgColor;
          let fontColor;
          if (
            theme.tiles !== undefined &&
            theme.tiles[grid[i][j].value] !== undefined
          ) {
            tileTheme = theme.tiles[grid[i][j].value];
            if (tileTheme.font !== undefined) fontColor = tileTheme.font;
            else fontColor = data.appearance.fontColor[grid[i][j].value];
            if (tileTheme.bg !== undefined) bgColor = tileTheme.bg;
            else bgColor = data.appearance.color[grid[i][j].value];
          } else {
            fontColor = data.appearance.fontColor[grid[i][j].value];
            bgColor = data.appearance.color[grid[i][j].value];
          }

          if (
            grid[i][j].value != "" &&
            grid[i][j].display.search("img") === -1
          ) {
            let fontSize = data.fontSizes[grid[i][j].display.length - 1];
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
            c.fillStyle = bgColor !== undefined ? bgColor : "black";
            c.fillRect(j * rectW + 5, i * rectH + 5, rectW - 5, rectH - 5);
            var args = grid[i][j].display.split(" ");
            var image = new Image();
            image.onload = function () {
              if (data.appearance.fontColor[grid[i][j].value] !== "black")
                c.filter = "invert(1)";
              c.drawImage(this, j * rectW + 5, i * rectH + 5);
              c.filter = "invert(0)";
            };
            image.src = images[args[1]];
          }
        }
      }
    },

    isGameOver() {
      let grid = this.grid;
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (grid[i][j].value == "") {
            return false;
          }

          if (i !== 3 && grid[i][j].value === grid[i + 1][j].value) {
            return false;
          }

          if (j !== 3 && grid[i][j].value === grid[i][j + 1].value) {
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
        this.previousGrid = pastGrid;
        this.undoUsed = false;
      }

      this.updateCanvas();

      let gameOver = this.isGameOver();
      if (gameOver) console.log("GAME OVER");
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

    undo() {
      this.grid = this.previousGrid;
      this.previousGrid = [];
      this.updateCanvas();
      this.undoUsed = true;
    },

    onThemeChanged(e) {
      this.currentTheme = e.target.value;
      localStorage.setItem("theme", e.target.value);
      this.updateCanvas();
    },

    onBGChanged(e) {
      this.currentBG = e.target.value;
      localStorage.setItem("bg", e.target.value);
    },

    onCtrlsShownChanged(e) {
      this.controlsShown = e.target.checked;
      localStorage.setItem("controlsShown", e.target.checked);
    },

    login() {
      var provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope("https://www.googleapis.com/auth/userinfo.profile");
      firebase.auth().languageCode = "ru";
      firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          return firebase
            .auth()
            .signInWithPopup(provider)
            .then((result) => {
              var credential = result.credential;

              var token = credential.accessToken;
              console.log(token);
              var user = result.user;
              console.log(user);
              this.displayName = user.displayName;
              this.photo = user.photoURL;
              this.loggedIn = true;
            })
            .catch((error) => {
              // Handle Errors here.
              // var errorCode = error.code;
              // var errorMessage = error.message;
              console.error(error.message);
              // The email of the user's account used.
              // var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              // var credential = error.credential;
              // ...
            });
        });
    },

    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.loggedIn = false;
        })
        .catch((error) => {
          console.error(error.message);
        });
    },
  },

  mounted() {
    this.updateCanvas();

    var canv = document.querySelector("canvas");
    SwipeListener(canv);
    canv.addEventListener("swipe", (e) => {
      e.preventDefault();
      var dirs = e.detail.directions;

      if (dirs.left) this.move("left");
      if (dirs.right) this.move("right");
      if (dirs.top) this.move("up");
      if (dirs.bottom) this.move("down");
    });
    canv.addEventListener("touchstart", (e) => e.preventDefault());
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.loginPending = false;
        this.loggedIn = true;
        this.displayName = user.displayName;
        this.photo = user.photoURL;
      } else {
        this.loginPending = false;
      }
    })
  },

  created() {
    let savedTheme = localStorage.getItem("theme");
    let savedBG = localStorage.getItem("bg");
    let ctrlsShown = localStorage.getItem("controlsShown");
    if (savedTheme !== null) {
      this.currentTheme = savedTheme;
    }
    this.currentBG = savedBG;
    if (ctrlsShown !== null) {
      this.controlsShown = ctrlsShown;
    }
  },
};
</script>

<style>
@import url(./themes/default.css);
@import url(./themes/night.css);

body {
  margin: 0;
}

div.menu {
  position: absolute;
  background: white;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

div.menu button {
  padding: 5px;
  width: fit-content;
  margin: 5px;
}

p,
h1 {
  padding: 5px;
  margin: 2px;
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
  display: flex;
  flex-direction: column;
  justify-items: center;
  justify-content: center;
  height: 100vh;
  margin: 0;
  background-size: cover !important;
  background-position: center !important;
}

h1 {
  font-family: Avenir, Helvetica, Arial, sans-serif-serif;
  font-size: 50px;
  font-weight: normal;
}

div.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

div.container.vertical {
  flex-direction: column !important;
}

div.container.gameOver {
  width: 305px;
  height: 305px;
  position: absolute;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 2px;
}

button,
select {
  padding: 5px;
  margin: 2.5px;
  border: 1px solid black;
  outline: none;
  font-size: 15px;
  border-radius: 5px;
  background: rgb(220, 220, 220);
  color: rgb(50, 50, 50);
  transition-duration: 0.1s;
  transition-property: all;
  user-select: none;
}

button:active {
  background: rgb(100, 100, 100);
  color: white;
  transform: scale(0.95);
}

button:disabled {
  opacity: 0.5;
}

table button {
  width: 75px;
  height: 75px;
  border-radius: 10px;
  font-size: 50px;
  margin: 0px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

canvas,
p {
  border-radius: 2px;
}

div.menu p {
  background: none;
}

div.authbox {
  position: fixed;
  top: 0;
  right: 0;
  margin: 10px;
  z-index: 12;
}

div.authbox > div {
  display: flex;
}

div.authbox > div img {
  width: 32px;
  border-radius: 5px;
}
</style>
