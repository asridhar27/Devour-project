import express from "express";
import { UserModel } from "../models/User";
import { CommunityModel } from "../models/Community";
const userRouter = express.Router();

/**
 * @route GET /user/:id
 * @param {string} id - User ID
 * @returns {User} - User object with experiencePoints field
 */
userRouter.get("/:id", async (req, res) => {
	const user = await UserModel.findById(req.params.id).select('+experiencePoints');
	if (!user) {
		return res.status(404).send({ message: "User not found" });
	}
	res.send(user);
});

/**
 * @route GET /user
 * @returns {Array} - Array of User objects
 * @note Adds the virtual field of totalExperience to the user.
 * @hint You might want to use a similar aggregate in your leaderboard code.
 */
userRouter.get("/", async (_, res) => {
	const users = await UserModel.aggregate([
		{
			$unwind: "$experiencePoints"
		},
		{
			$group: {
				_id: "$_id",
				email: { $first: "$email" },
				profilePicture: { $first: "$profilePicture" },
				totalExperience: { $sum: "$experiencePoints.points" },
				currentCommunity: { $first: "$currentCommunity"}
			}
		}
	]);
	res.send(users);
});

/**
 * @route POST /user/:userId/join/:communityId
 * @param {string} userId - User ID
 * @param {string} communityId - Community ID
 * @description Joins a community
 */
userRouter.post("/:userId/join/:communityId", async (req, res) => {
    const { userId, communityId } = req.params;
    try {
        const user = await UserModel.findById(userId);
		const community = await CommunityModel.findById(communityId);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        if (user.currentCommunity && user.currentCommunity !== community?._id) {
            return res.status(400).send({ message: "User is already a member of another community. Leave the current community before joining another." });
        }

        user.currentCommunity = community?._id;
        await user.save();

        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
});


/**
 * @route DELETE /user/:userId/leave/:communityId
 * @param {string} userId - User ID
 * @param {string} communityId - Community ID
 * @description leaves a community
 */
userRouter.delete("/:userId/leave/:communityId", async (req, res) => {
    const { userId, communityId } = req.params;
    try {
        const user = await UserModel.findById(userId);
		const community = await CommunityModel.findById(communityId);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        if (!user.currentCommunity?.equals(community?._id)) {
			console.log("User is not a member of the provided community");
            return res.status(400).send({ message: "User is not a member of the provided community" });
        }

        user.currentCommunity = null;
        await user.save();
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
});


export {
    userRouter
}
