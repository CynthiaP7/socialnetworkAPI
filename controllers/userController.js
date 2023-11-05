const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
//get all users
    async getUsers (req, res) {
        try {
            const users = await User.find ();
            const userObj = { users } ;
            return res.json(userObj);
        } catch (err) {
            return res.status(500).json(err);
        }
    },

//get single user
    async getSingleUser (req, res) {
        try {
            const users = await User.findOne ({_id: req.params.userId})
            .select("-__v")
            .populate("thoughts")
            .lean();
    
        if (!user) {
            return res.status(404).json({ message: "No user with that ID"});
        }
        res.json({ user });
         }  catch (err) {
            console.log(err);
            return res.status(500).json(err);
    }
},

//create a new user 
async createUser (req, res) {
    try {
        const user = await User.create (req.body);
        res.json(user);
     }  catch (err) {
        console.log(err);
        return res.status(500).json(err);
}
},

//update user
async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true}
      );

      if (!user) {
        return res.status(404).json({ message: "No user with this id!" });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

//delete user
async deleteUser (req, res) {
    try {
        const user = await User.findOneAndRemove({ _id: req.params.userId });
    
        if (!user) {
            return res.status(404).json({ message: "No user with this id!" });
          }

        const thought = await Thought.findOneAndUpdate(
            { users: req.params.userId },
            { $pull: { users: req.params.userId } },
            { new: true }
        );
        
        if (!thought) {
            return res.status(404).json({ 
                message: "User and thoughts deleted ",
            });
          }

          res.json({ message: "User successfully removed "});
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    },

// add friend
async addFriend(req, res) {
    try {
      console.log("You are adding a friend");
      const friend = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
        
      );
      if (!friend) {
        return res
          .status(404)
          .json({ message: "No friend found with that ID" });
      }
      res.json(friend);
    } catch (error) {
      console.log("Error");
    }
  },


// remove friend
async removeFriend(req, res) {
    try {
        const friend = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { runValidators: true, new: true }   
        );

        if (!friend) {
            return res
              .status(404)
              .json({ message: "No friend found with that ID" });
          }
          res.json(friend);
        } catch (err) {
          res.status(500).json(err);
        }
      },

};

