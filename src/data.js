export default {
  startingTiles: [
    "m",
  ],
  fontSizes: [64, 48, 32],
  appearance: {
    color: {
      m: "#eee4da",
      V: "#eee1c9",
      P: "#f3b27a",
      S: "#f69664",
      F: "#f67c5f",
      E: "#f65e3b",
      A: "#edcf72",
      U: "#edcc61",
      I: "#edc850",
      R: "#edc53f",
      T: "#edc22e",
      Q: "#3e3933",
      l: "#191715",
      t: "#212044",
      υ: "#393977",
    },
    fontColor: {
      m: "black",
      V: "black",
    },
    display: {
      "m": ["m", "кг", "img scale"]
    }
  },
  combinations: {
    "m m": "V",
    "V V": "P",
    "P P": "S",
    "S S": "F",
    "F F": "E",
    "E E": "A",
    "A A": "U",
    "U U": "I",
    "I I": "R",
    "R R": "T",
    "T T": "Q",
    "Q Q": "l",
    "l l": "t",
    "t t": "υ",
  },
};
