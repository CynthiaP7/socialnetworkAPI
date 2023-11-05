const { Thought, User } = require('../models');

module.exports = {

//get all thoughts
    async getAllThoughts(req,res) {
        try {
            const thoughts = await Thought.find({}).populate('reactions');
            const thoughtObj = { thoughts };
            res.json(thoughtObj);
        } catch (err) {
            res.status(500).json(err);
          }
    },

//get one thought by id

async getThoughtById (req, res) {
    try {
        const thought = Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v')
        .populate("reactions")

      if (!thought) {
        return res.status(404).json({ message: "No Thought with that ID" });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //create one thought

  async createThought (req, res) {
        try {
            const dbThoughtData = await Thought.create(body);
            const dbUserData = await User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: dbThoughtData._id } },
                { new: true }
            );
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbUserData);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    // delete thought
    async deleteThought (req,res) {
        try {
            const thought = await Thought.findOneAndDelete ({
                _id: req.params.thoughtId,
            });
            if (!thought) {
                return res.status(404).json({ error: "No thought found with that id" });   
            }
            const userData = await User.findOneAndUpdate(
            { thoughts: req.params.thoughtId },
            { $pull: { thoughts: req.params.thoughtId } },
            { new: true }
        );
        if (!userData) {
            return res.json({ error: "No user found with that id" }); 
        }
        return res.json({ message: "Thought deleted" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  //update a thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //add reaction to a thought
  async addReaction (req, res) {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { new: true, runValidators: true }
        );
        if (!thought) {
            return res.status(404).json({ error: "No thought found with that id" });
        }
         res.json(thought);
        } catch (error) {
        return res.status(500).json({ error: error.message });
        }
    },


//remove reaction
async removeReaction (req, res) {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true, runValidators: true }
          );  
          if (!thought) {
            return res.status(404).json({ error: "No thought found with that id" });
          }
          res.json(thought);
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      },
    };

        






