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

router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: "The post with the specified ID does not exist"
        });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "The post information could not be retrieved"
      });
    });
});

router.post('/', (req, res) => {
  const postFromClient = req.body;
  if(!postFromClient.title || !postFromClient.contents) {
    res.status(400).json({
      message: "Please provide title and contents for the post"
    });
  } else {
    Post.insert(req.body)
    .then(post => {
      console.log(post.id);
      Post.findById(post.id)
        .then( newPost => {
          res.status(201).json(newPost);
        })
        .catch(err => {
          console.log(err);
        })
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "There was an error while saving the post to the database",
      });
    });
  }
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const updatedPost = req.body;
    if ( !updatedPost.title || !updatedPost.contents ) {
      res.status(400).json({
        message: "Please provide title and contents for the post"
      });
    }
  Post.update(id, updatedPost)
    .then(post => {
      if (post) {
        Post.findById(id)
        .then( newPost => {
          res.status(201).json(newPost);
        })
        .catch(err => {
          console.log(err);
        })
      } else {
        res.status(404).json({
          message: "The post with the specified ID does not exist"
        });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "The post information could not be modified"
      });
    });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  Post.findById(id)
    .then(post => {
      if (post) {
        Post.remove(id)
          .then(count => {
            console.log(count);
            res.status(200).json(post);
          })
          .catch( (err) => {
            console.log(err);
            res.status(500).json({
              message: "The post could not be removed"
            });
          }) 
        } else {
          res.status(404).json({
            message: "The post with the specified ID does not exist"
          });
        }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "The post could not be removed"
      });
    })
});

router.get('/:id/comments', (req, res) => {
  Post.findPostComments(req.params.id)
    .then(comments => {
      if (comments.length > 0) {
        res.status(200).json(comments);
      } else {
        res.status(404).json({
          message: "There are no comments for this post or the post with the specified ID does not exist"
        });
      } 
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "The comments information could not be retrieved"
      });
    });
});

module.exports = router;