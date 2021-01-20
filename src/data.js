export default {
  startingTiles: ["c", "m", "∆t"],
  fontSizes: [64, 48, 32],
  appearance: {
    c: {
      color: "rgb(255, 0, 0)",
    },
    m: {
      color: "rgb(0, 255, 0)",
    },
    cm: {
      color: "rgb(0, 0, 255)",
    },
    "∆t": {
      color: "rgb(0, 0, 0)"
    },
    Q: {
      color: "rgb(0, 255, 255)"
    }
  },
  combinations: {
    c: [
      {
        with: "m",
        result: "cm",
      },
    ],
    m: [
      {
        with: "c",
        result: "cm",
      },
    ],
    "∆t": [
      {
        with: "cm",
        result: "Q"
      }
    ]
  },
};
