const { User } = require('../models')

const userController = {
    //get all users
    getAllUser(req,res) {
        User.find({})
        .populate({
            path: 'thoughts',
            select: '-__v'
         })
        .select('-__v')
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err)
            res.status(404).json(err)
        });
      },

    //create a user
    createUser({ body }, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(404).json(err));
    },

    //get a user by Id
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
           .populate({
               path: 'thoughts',
               select: '-__v'
            })
            .populate ({
                path: 'friends',
                select: '-__v'
            })
           .select('-__v')
           .then(dbUserData => res.json(dbUserData))
           .catch(err => {
               console.log(err)
               res.status(404).json(err)
        });
     },

    //update a user by Id
    updateUser({ params, body}, res) {
        User.findOneAndUpdate({ _id: params.id}, body, { new: true, runValidators: true})
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'User not found with this Id' });
                return;
            }
            res.json(dbUserData);
        })
           .catch(err => res.json(err))
    },

    //delete a user by Id
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'User not found with this Id' });
            return;
        }
        res.json(dbUserData);
        })
        .catch(err => res.status(404).json(err))
    },

    //add a friend
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            {_id: params.userId},
            { $push: { friends: params.friendId } },
            { new: true, runValidators: true}
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'User not found with this Id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    //delete a friend by id
    deleteFriend( { params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId }},
            { new: true}
        )
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err));
    }

};

module.exports = userController 