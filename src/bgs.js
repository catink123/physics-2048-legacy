var context = require.context("./assets/bgs", false, /\.jpg$/);

export default {
  "ak-47": {
    name: "АК-47",
    image: context("./ak-47.jpg")
  },
  autumn: {
    name: "Осень",
    image: context("./autumn.jpg")
  },
  beach: {
    name: "Пляж",
    image: context("./beach.jpg")
  },
  city: {
    name: "Город",
    image: context("./city.jpg")
  },
  car: {
    name: "Машина",
    image: context("./car.jpg")
  },
  fire: {
    name: "Огонь",
    image: context("./fire.jpg")
  },
  flowers: {
    name: "Цветы",
    image: context("./flowers.jpg")
  },
  guitar: {
    name: "Гитара",
    image: context("./guitar.jpg")
  },
  joker: {
    name: "Джокер",
    image: context("./joker.jpg")
  },
  leaf: {
    name: "Лист",
    image: context("./leaf.jpg")
  },
  minimalistic_city: {
    name: "Минималистический город",
    image: context("./minimalistic_city.jpg")
  },
  neon_samurai: {
    name: "Неоновый самурай",
    image: context("./neon_samurai.jpg")
  },
  paint: {
    name: "Краски",
    image: context("./paint.jpg")
  },
  rainforest: {
    name: "Бледный лес",
    image: context("./rainforest.jpg")
  },
  shapes1: {
    name: "Фигуры 1",
    image: context("./shapes1.jpg")
  },
  shapes2: {
    name: "Фигуры 2",
    image: context("./shapes2.jpg")
  },
  sky: {
    name: "Небо",
    image: context("./sky.jpg")
  },
  squares: {
    name: "Квадраты",
    image: context("./squares.jpg")
  }
}