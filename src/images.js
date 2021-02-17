var context = require.context("./assets/images", false, /\.png$/);

var images = {
  scale: context("./scale.png"),
  ruler: context("./ruler.png"),
  clock: context("./clock.png"),
  speedometer: context("./speedometer.png"),
  cube: context("./cube.png"),
  plotnost: context("./plotnost.png"),
  press: context("./press.png"),
  uskorenie: context("./uskorenie.png"),
  dynamometer: context("./dynamometer.png"),
  resistance: context("./resistance.png"),
  amperemeter: context("./amperemeter.png"),
  voltmeter: context("./voltmeter.png"),
  motor: context("./motor.png"),
  work: context("./work.png"),
}

export default images;
