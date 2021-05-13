const router = require("express").Router();
const Post = require("../models/postModel");
const User = require('../models/userModel');
const { findUserById, findPostById } = require("../controllers/postController")
const {isLoggedIn, isAdmin, isAuthenticated} = require("../middleware/auth");


router.post("/create/:userId", isLoggedIn, isAdmin, isAuthenticated, async (req, res) => {
  try {
    const { title, description } = req.body;

    const newPost = new Post({
      title,
      description
    });

    const savedPost = await newPost.save();
    res.json(savedPost);

  } catch (err) {
    res.send(err.message);
    res.status(500).send();
  }
});

router.get("/allposts", isAuthenticated, async (req, res) => {
  try {
    const {page=1, limit=10} = req.query
    const posts = await Post.find()
    .limit(limit * 1)
    .skip((page - 1) * limit);
    res.json({total:posts.length, posts});
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

//update

router.patch("/update/:userId/:postId", isLoggedIn, isAdmin, isAuthenticated, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdate = ["title", "description"]
  const isValidOperation = updates.every((update)=>allowedUpdate.includes(update))
  
  if(!isValidOperation){
    return res.status(400).send({error:'Invalid updates!'})
  }
  try{
    const update_post = await Post.findById(req.params.postId)
    updates.forEach((update)=>update_post[update]=req.body[update])
    await update_post.save()
    //const update_post = await Post.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
    if(!update_post){
      return res.status(404).send()
    }
    res.send(update_post)

  }catch(e){
    res.status(400).send(e)
  }
});

// delete

router.delete('/delete/:userId/:postId', isLoggedIn, isAdmin, isAuthenticated, async(req,res)=>{
    try{
        const delete_post = await Post.findByIdAndDelete(req.params.postId)
        if(!delete_post){
            return res.status(404).send()
        }
        res.send(delete_post)
    }catch(e){
        res.status(400).send(e)
    }
})

//to check weather the is a pramerter of user_id in the route then we need to execute the
//findUserById method
router.param("userId", findUserById);

//findPeoductById method
router.param("postId", findPostById);

module.exports = router;
