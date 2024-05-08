import {Request, Response} from "express";
import Logger from "../../config/logger";
import * as petitionSupporter from "../models/petition.supporter.model"
import {validate} from "../resources/validate";
import * as schemas from '../resources/schemas.json';
import * as user from "../models/user.model";
import * as petition from "../models/petition.model"

const getAllSupportersForPetition = async (req: Request, res: Response): Promise<void> => {
    try {
        // Extract the petition ID from the request parameters
        const petitionId = parseInt(req.params.id, 10);

        if (isNaN(petitionId)) {
            res.statusMessage = 'Bad Request: Petition ID must be a number';
            res.status(400).send();
            return;
        }

        const supporters = await petitionSupporter.getAllSupportersForPetition(petitionId);

        if (!supporters) {
            res.statusMessage = 'Not Found: No petition with Id';
            res.status(404).send();
            return;
        }

        res.status(200).json(supporters);
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
}
const addSupporter = async (req: Request, res: Response): Promise<void> => {
    const validation = await validate(schemas.support_post, req.body);
    if (validation !== true) {
        res.statusMessage = `Bad Request: ${validation.toString()}`;
        res.status(400).send();
        return;
    }
    try {
        // Parse petition ID from request parameters
        const petitionId = parseInt(req.params.id,10);
        if (isNaN(petitionId)) {
            res.statusMessage = 'Bad Request: Petition ID must be a number';
            res.status(400).send();
            return;
        }

        // Check if the petition exists
        const  existingPetition = await petition.petitionExists(petitionId);
        if (!existingPetition) {
            res.statusMessage = 'Not Found: No petition found with id';
            res.status(404).send();
            return;
        }

        // Extract authentication token from request headers
        const authToken = req.headers['x-authorization'] || req.headers['X-Authorization'] || req.headers['x-Authorization'];

        // Validate token and retrieve user
        const tokenUser = await user.findByAuthToken(authToken as string);
        if (!authToken || !tokenUser) {
            res.statusMessage = 'Unauthorized';
            res.status(401).send();
            return;
        }

        const petitionFound = await petition.getPetitionById(petitionId);
        // Check if the user is trying to support their own petition
        if (petitionFound.ownerId === tokenUser.id) {
            res.statusMessage = 'Forbidden: Cannot support your own petition';
            res.status(403).send();
            return;
        }

        // Extract support tier ID from request body
        const supportTierId = req.body.supportTierId;

        // Check if the support tier exists
        const existingSupportTier = await petitionSupporter.getSupportTierById(supportTierId);
        if (!existingSupportTier) {
            res.statusMessage = 'Not Found: Support tier does not exist';
            res.status(404).send();
            return;
        }

        // Check if the user has already supported at this tier
        const hasSupported = await petitionSupporter.hasSupportedAtTier(tokenUser.id, petitionId, supportTierId);
        if (hasSupported) {
            res.statusMessage = 'Forbidden: Already supported at this tier';
            res.status(403).send();
            return;
        }

        // Add supporter to the petition
        await petitionSupporter.addSupporter(petitionId, tokenUser.id, supportTierId, req.body.message);

        // Send success response
        res.status(201).send();
    } catch (err) {
        Logger.error(err);
        res.statusMessage = 'Internal Server Error';
        res.status(500).send();
        return;
    }
}

export {getAllSupportersForPetition, addSupporter}