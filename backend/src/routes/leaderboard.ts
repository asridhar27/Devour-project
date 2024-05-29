import express from 'express';
import { UserModel } from '../models/User';
import { CommunityModel } from '../models/Community';

const leaderboardRouter = express.Router();

/**
 * @route GET /leaderboard
 * @returns {Array} - Array of communities with their total experience points and number of members
 */
leaderboardRouter.get('/', async (_, res) => {
    try {
        const userAggregation = await UserModel.aggregate([
            { $match: { currentCommunity: { $ne: null } } },
            {
                $group: {
                    _id: '$currentCommunity',
                    totalExperience: { $sum: { $sum: '$experiencePoints.points' } },
                    numberOfUsers: { $sum: 1 }
                }
            }
        ]);

        const communityIds = userAggregation.map(user => user._id);
        const communities = await CommunityModel.find({ _id: { $in: communityIds } });


        const leaderboard = userAggregation.map(user => {
            const community = communities.find(community => community._id.equals(user._id));
            return {
                communityId: community?._id,
                communityName: community?.name,
                communityLogo: community?.logo,
                totalExperience: user.totalExperience,
                numberOfUsers: user.numberOfUsers
            };
        });

        leaderboard.sort((a, b) => b.totalExperience - a.totalExperience);
        res.json(leaderboard);
    } catch (error) {
        res.sendStatus(500);
    }
});

export {
    leaderboardRouter
};