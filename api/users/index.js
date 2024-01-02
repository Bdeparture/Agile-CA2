import express from 'express';
import User from './userModel';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

const router = express.Router(); // eslint-disable-line

async function registerUser(req, res) {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
        await User.create(req.body);
        res.status(201).json({success: true, msg: 'User successfully created.'});
    } else {
        res.status(401).json({success: false, msg: 'User existed!'});
    }
}

async function authenticateUser(req, res) {
  const user = await User.findByUserName(req.body.username);
  if (!user) {
      return res.status(401).json({ success: false, msg: 'Authentication failed. User not found.' });
  }

  const isMatch = await user.comparePassword(req.body.password);
  if (isMatch) {
      const token = jwt.sign({ username: user.username }, process.env.SECRET);
      res.status(200).json({ success: true, token: 'BEARER ' + token });
  } else {
      res.status(401).json({ success: false, msg: 'Wrong password.' });
  }
}

// Get all users
/**,
 * @swagger
 * /api/users:
 *    get:
 *      tags:
 *       - users
 *      summary: 
 *      operationId: 
 *      produces:
 *      - application/json
 *      responses:
 *        200:
 *          description:  "successful operation"
 * */
router.get("/", async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

// register(Create)/Authenticate User
/**,
 * @swagger
 * /api/users:
 *    post:
 *      tags:
 *       - users
 *      summary: register
 *      operationId: 
 *      produces:
 *      - application/json
 *      responses:
 *        200:
 *          description: "successful operation"
 * */
router.post('/', asyncHandler(async (req, res) => {
    try {
        if (!req.body.username || !req.body.password) {
            return res.status(400).json({ success: false, msg: 'Username and password are required.' });
        }
        if (req.query.action === 'register') {
            await registerUser(req, res);
        } else {
            await authenticateUser(req, res);
        }
    } catch (error) {
        // Log the error and return a generic error message
        console.error(error);
        res.status(500).json({ success: false, msg: 'Internal server error.' });
    }
  }));

// Update a user
/**,
 * @swagger
 * /api/update/:id:
 *    put:
 *      tags:
 *       - users
 *      summary: Update a user
 *      operationId: 
 *      produces:
 *      - application/json
 *      responses:
 *        200:
 *          description: "successful operation"
 * */
router.put("/update/:id", async (req, res) => {
  if (req.body._id) delete req.body._id;
  const user = await User.findById(req.params.id);
  if (user) {
    user.username = req.body.username;
    user.password = req.body.password;
    await user.save();
    res.status(200).json({ code: 200, msg: "User Updated Sucessfully" });
  } else {
    res.status(404).json({ code: 404, msg: "User not found" });
  }
});

// Delete a user
   /**,
 * @swagger
 * /api/delete/:id:
 *    delete:
 *      tags:
 *       - users
 *      summary: 
 *      operationId: 
 *      produces:
 *      - application/json
 *      responses:
 *        200:
 *          description: delete userId
 * */
router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  User.findByIdAndDelete(id, (err, user) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(user);
    }
  });
});

//Add a favourite
/**,
 * @swagger
 * /api/users/:username/favourites:
 *    post:
 *      tags:
 *       - users
 *      summary: 
 *      operationId: 
 *      produces:
 *      - application/json
 *      responses:
 *        200:
 *          description: Add a favourite
 * */
router.post('/:userName/favourites', asyncHandler(async (req, res) => {
    const movieId = req.body.movieId;
    const userName = req.params.userName;
    try {
        await User.findOneAndUpdate(
            {username: userName}, 
            {$addToSet: {favouriteMovies: movieId}}, 
            {new: true}
        );
        res.status(200).json({message: 'Favourite movie added successfully'});
    } catch (error) {
        res.status(500).json({message: 'Error adding favourite movie'});
    }
  }));

/**,
 * @swagger
 * /api/users/favourites:
 *    get:
 *      tags:
 *       - users
 *      summary: 
 *      operationId: 
 *      produces:
 *      - application/json
 *      responses:
 *        200:
 *          description: get favourite movieId
 * */
  router.get('/:userName/favourites', asyncHandler( async (req, res) => {
    const userName = req.params.userName;
    const user = await User.findByUserName(userName);
    res.status(200).json(user.favourites);
  }));

   /**,
 * @swagger
 * /api/users/favourites:
 *    delete:
 *      tags:
 *       - users
 *      summary: 
 *      operationId: 
 *      produces:
 *      - application/json
 *      responses:
 *        200:
 *          description: delete favourite movieId
 * */
  router.delete('/:username/favourites', asyncHandler(async (req, res) => {
    const userName = req.body.username;
    const movieId = req.body.movieId;

    try {
        await User.findOneAndUpdate(
            {username: userName},
            {$pull: {favouriteMovies: movieId}},
            {new: true}
        );
        res.status(200).json({message: 'Favourite movie removed successfully'});
    } catch (error) {
        res.status(500).json({message: 'Error removing favourite movie'});
    }
}));
export default router;