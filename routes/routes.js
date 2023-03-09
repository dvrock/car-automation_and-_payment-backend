const router = require("express").Router();
const user = require("../controllers/carController");
const car = require("../controllers/mainController");
const image = require("../middleware/fileupload");
const auth = require("../controllers/authenticate");

router.post("/registerUser", image.uploadImg.single("image"), user.Register);

router.post("/login", user.Login);
router.get("/home/categories", car.Categories);
router.patch("/home/tourCancelled", car.tourCancelled);
router.patch("/home/tourCompleted", car.tourComplete);
router.post("/home/pickCar", car.Car);
router.post("/home/", auth.Authenticate, user.Home);

router.patch(
  "/updatePic",
  auth.Authenticate,
  image.uploadImg.single("image"),
  car.picUpdate
);

router.get("/getUsers", user.getUsers);

router.patch(
  "/home/updateUser/:id",
  auth.Authenticate,
  image.uploadImg.single("image"),
  user.updateUser
);

module.exports = router;
