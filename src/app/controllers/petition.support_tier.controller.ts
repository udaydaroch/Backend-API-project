import {Request, Response} from "express";
import Logger from "../../config/logger";
import * as petitionSupportTeir from "../models/petition.support_tier.model"
import {validate} from "../resources/validate";
import * as schemas from '../resources/schemas.json';
import * as petition from "../models/petition.model"
import * as user from "../models/user.model";
const addSupportTier = async (req: Request, res: Response): Promise<void> => {
    const validation = await validate(schemas.support_tier_post, req.body);
    if (validation !== true) {
        res.statusMessage = `Bad Request: ${validation.toString()}`;
        res.status(400).send();
        return;
    }
    try{
        const petitionId = parseInt(req.params.id, 10);
        if (isNaN(petitionId)) {
            res.statusMessage = 'Bad Request: Petition ID must be a number';
            res.status(400).send();
            return;
        }

        const existingPetition = await petition.petitionExists(petitionId);
        if (!existingPetition) {
            res.statusMessage = "Not Found: No petition found with the provided ID";
            res.status(404).send();
            return;
        }

        const authToken =  req.headers["x-authorization"] || req.headers["X-Authorization"] || req.headers["x-Authorization"];
        const tokenUser = await user.findByAuthToken(authToken);
        if (!authToken || !tokenUser) {
            res.statusMessage = "Unauthorized";
            res.status(401).send();
            return;
        }
        const existingSupportTiersCount = await petitionSupportTeir.getSupportTiersCount(petitionId);
        if (existingSupportTiersCount >= 3) {
            res.statusMessage = 'Forbidden: Cannot add a support tier if 3 already exist';
            res.status(403).send();
            return;
        }

        const isOwner = await petition.isOwnerOfPetition(tokenUser.id, petitionId);
        if (!isOwner) {
            res.statusMessage = "Forbidden: Only the owner of a petition may delete it";
            res.status(403).send();
            return;
        }
        const title = req.body.title;
        const isTitleUnique = await petitionSupportTeir.isTitleUniqueInPetition(title, petitionId);
        if (!isTitleUnique) {
            res.statusMessage = 'Forbidden: Support tier title not unique within the petition';
            res.status(403).send();
            return;
        }

        await petitionSupportTeir.addSupportTier(petitionId, req.body.title, req.body.description, req.body.cost);
        res.status(201).send();
        return;
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
}

const editSupportTier = async (req: Request, res: Response): Promise<void> => {
    try {

        const validation = await validate(schemas.support_tier_patch, req.body);
        if (validation !== true) {
            res.statusMessage = `Bad Request: ${validation.toString()}`;
            res.status(400).send();
            return;
        }
        const petitionId = parseInt(req.params.id, 10);
        const tierId = parseInt(req.params.tierId, 10);

        // Check if petitionId is a valid number
        if (isNaN(petitionId)) {
            res.statusMessage = 'Bad Request: Petition ID must be a number';
            res.status(400).send();
            return;
        }

        if (isNaN(tierId)) {
            res.statusMessage = 'Bad Request: Tier ID must be a number';
            res.status(400).send();
            return;
        }

        const existingPetition = await petition.petitionExists(petitionId);
        if (!existingPetition) {
            res.statusMessage = "Not Found: No petition found with the provided ID";
            res.status(404).send();
            return;
        }

        const existingTier = await petitionSupportTeir.getSupportTierById(tierId);
        if (!existingTier) {
            res.statusMessage = "Not Found: No support tier found with the provided ID";
            res.status(404).send();
            return;
        }

        const authToken = req.headers["x-authorization"] || req.headers["X-Authorization"] || req.headers["x-Authorization"];
        const tokenUser = await user.findByAuthToken(authToken);
        if (!authToken || !tokenUser) {
            res.statusMessage = "Unauthorized";
            res.status(401).send();
            return;
        }
        Logger.info(tokenUser.id, petitionId);
        const isOwner = await petition.isOwnerOfPetition(tokenUser.id, petitionId);
        Logger.info(isOwner);
        if (!isOwner) {
            res.statusMessage = "Forbidden: Only the owner of a petition may modify it";
            res.status(403).send();
            return;
        }

        const hasSupporters = await petitionSupportTeir.hasSupporters(tierId);
        if (hasSupporters) {
            res.statusMessage = "Forbidden: Cannot edit a support tier with existing supporters";
            res.status(403).send();
            return;
        }
        const title = req.body.title;
        const isTitleUnique = await petitionSupportTeir.isTitleUniqueInPetition(title, petitionId);
        if (title && !isTitleUnique) {
            res.statusMessage = 'Forbidden: Support tier title not unique within the petition';
            res.status(403).send();
            return;
        }

        await petitionSupportTeir.updateSupportTier(tierId, req.body.title, req.body.description, req.body.cost);
        res.status(200).send();
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
}


const deleteSupportTier = async (req: Request, res: Response): Promise<void> => {
    try {
        const petitionId = parseInt(req.params.id, 10);
        const tierId = parseInt(req.params.tierId, 10);
        if (isNaN(petitionId)) {
            res.statusMessage = 'Bad Request: Petition ID must be a number';
            res.status(400).send();
            return;
        }
        if (isNaN(tierId)) {
            res.statusMessage = 'Bad Request: Tier ID must be a number';
            res.status(400).send();
            return;
        }
        const existingPetition = await petition.petitionExists(petitionId);
        if (!existingPetition) {
            res.statusMessage = "Not Found: No petition found with the provided ID";
            res.status(404).send();
            return;
        }
        const authToken = req.headers["x-authorization"] || req.headers["X-Authorization"] || req.headers["x-Authorization"];
        Logger.info(authToken);
        const tokenUser = await user.findByAuthToken(authToken);
        if (!authToken || !tokenUser) {
            res.statusMessage = "Unauthorized";
            res.status(401).send();
            return;
        }
        const isOwner = await petition.isOwnerOfPetition(tokenUser.id, petitionId);
        if (!isOwner) {
            res.statusMessage = "Forbidden: Only the owner of a petition may delete it";
            res.status(403).send();
            return;
        }

        const existingTier = await petitionSupportTeir.getSupportTierById(tierId);
        if (!existingTier) {
            res.statusMessage = "Not Found: No support tier found with the provided ID";
            res.status(404).send();
            return;
        }

        const hasSupporters = await petitionSupportTeir.hasSupporters(tierId);
        if (hasSupporters) {
            res.statusMessage = "Forbidden: Cannot delete a support tier with existing supporters";
            res.status(403).send();
            return;
        }
        const isOnlyTier = await petitionSupportTeir.isOnlyTierForPetition(tierId, petitionId);
        if (isOnlyTier) {
            res.statusMessage = "Forbidden: Cannot delete the only support tier for a petition";
            res.status(403).send();
            return;
        }
        await petitionSupportTeir.deleteSupportTier(tierId);

        res.status(200).send();
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
}

export {addSupportTier, editSupportTier, deleteSupportTier};