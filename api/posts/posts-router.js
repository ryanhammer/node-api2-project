// implement your posts router here
const router = require("express").Router();
const Post = require("./posts-model");

router.get('/', (req, res) => {
  Post.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "The posts information could not be retrieved",
      });
    });
});


module.exports = router;