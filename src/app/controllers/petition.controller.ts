import {Request, Response} from "express";
import Logger from '../../config/logger';
import * as petition from '../models/petition.model';
import * as schemas from '../resources/schemas.json';
import {validate} from "../resources/validate";
import * as user from "../models/user.model";
import {petitionExists} from "../models/petition.model";
const getAllPetitions = async (req: Request, res: Response): Promise<void> => {
    const validation = await validate(schemas.petition_search, req.query);
    if (validation !== true) {
        res.statusMessage = `Bad Request: ${validation.toString()}`;
        res.status(400).send();
        return;
    }
    Logger.info("validation passed" + validation);
    try{
        const {startIndex,
            count,
            q,
            categoryIds,
            supportingCost,
            ownerId,
            supporterId,
            sortBy} = req.query;
        const petitionParams: any = {};
        if (req.query.hasOwnProperty("startIndex")) {
            if (isNaN(parseInt(startIndex as string,10))) {
                res.statusMessage = 'Bad Request: startIndex must be a number';
                res.status(400).send();
                return;
            }
            petitionParams.startIndex = startIndex;
        }

        if (req.query.hasOwnProperty("count")) {
            if (isNaN(parseInt(count as string, 10))) {
                res.statusMessage = 'Bad Request: count must be a number';
                res.status(400).send();
                return;
            }
            petitionParams.count = count;
        }

        if (req.query.hasOwnProperty("q")) petitionParams.q = q;

        if (req.query.hasOwnProperty("categoryIds")) {
            if(typeof categoryIds === "string") {
                if(categoryIds.includes(",")) {
                    res.statusMessage = "Bad Request: invalid category syntax";
                    res.status(400).send();
                    return;
                }
            }
            const categoryIdsArray = Array.isArray(categoryIds) ? categoryIds: [categoryIds];
            // Validate all elements are numeric or can be converted to numeric
            if (!categoryIdsArray.every(id => !isNaN(parseInt(id as string, 10)))) {
                res.statusMessage = "Bad Request: All categoryIds must be numeric.";
                res.status(400).send();
                return;
            }
            const numericIds = categoryIdsArray.map(id => parseInt(id as string, 10));
            const allCategoriesExist = await petition.categoriesExist(numericIds);
            if (!allCategoriesExist) {
                res.statusMessage = 'Bad Request: No such category id(s).';
                res.status(400).send();
                return;
            }

            petitionParams.categoryIds = categoryIdsArray.map(id => parseInt(id as string, 10));
        }

        if (req.query.hasOwnProperty("supportingCost")) {
            if (isNaN(parseInt(supportingCost as string, 10))) {
                res.statusMessage = 'Bad Request: supportingCost must be a number';
                res.status(400).send();
                return;
            }
            petitionParams.supportingCost = supportingCost;
        }

        if (req.query.hasOwnProperty("ownerId")) {
            if (isNaN(parseInt(ownerId as string, 10))) {
                res.statusMessage = 'Bad Request: ownerId must be a number';
                res.status(400).send();
                return;
            }
            petitionParams.ownerId = ownerId;
        }

        if (req.query.hasOwnProperty("supporterId")) {
            if (isNaN(parseInt(supporterId as string, 10))) {
                res.statusMessage = 'Bad Request: supporterId must be a number';
                res.status(400).send();
                return;
            }
            petitionParams.supporterId = supporterId;
        }

        if (req.query.hasOwnProperty("sortBy")) petitionParams.sortBy = sortBy;

        Logger.info(petitionParams);
        const answer = await petition.viewAllPetitions(petitionParams);
        res.statusMessage = "Ok";
        res.status(200).send(answer);
        return;
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
}
const getPetition = async (req: Request, res: Response): Promise<void> => {
    try{
         const petitionId = parseInt(req.params.id, 10);
         if (isNaN(petitionId)) {
            res.statusMessage = 'Bad Request: id not a number';
            res.status(400).send();
            return;
        }
        const foundPetition = await petition.petitionExists(petitionId);
         Logger.info(foundPetition);
        if (!foundPetition) {
            res.statusMessage = 'Not Found: Petition not found';
            res.status(404).send();
            return;
        }
        const founded = await petition.getPetitionById(petitionId);
        Logger.info(founded);
        res.status(200).json(founded);
        return;
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
}
const addPetition = async (req: Request, res: Response): Promise<void> => {
    const validation = await validate(schemas.petition_post, req.body);
    if (validation !== true) {
        res.statusMessage = `Bad Request: ${validation.toString()}`;
        res.status(400).send();
        return;
    }
    try{
        const authToken = req.headers["x-authorization"] || req.headers["X-Authorization"] || req.headers["x-Authorization"];
        const tokenUser = await user.findByAuthToken(authToken);
        if(!authToken || !tokenUser) {
            res.statusMessage = "Unauthorized";
            res.status(401).send();
            return;
        }

        const { title, description, categoryId, supportTiers } = req.body;
        const categoryExists = await petition.categoryExists(categoryId);
        if (!categoryExists) {
            res.statusMessage = "Bad Request: Category does not exist";
            res.status(400).send();
            return;
        }
        if (supportTiers.length < 1 || supportTiers.length > 3) {
            res.statusMessage = "Bad Request: A petition must have between 1 and 3 support tiers";
            res.status(400).send();
            return;
        }
        Logger.info(title);
        const titleUnique = await petition.isTitleUnique(title);
        Logger.info(titleUnique);
        if(!titleUnique) {
            res.statusMessage = "Forbidden: Petition title already exists";
            res.status(403).send();
            return;
        }
        const uniqueTitles = new Set<string>();
        for (const tier of supportTiers) {
            if (uniqueTitles.has(tier.title)) {
                res.statusMessage = "Bad Request: Each support tier title must be unique";
                res.status(400).send();
                return;
            }
            uniqueTitles.add(tier.title);
        }

        const petitionId = await petition.createPetition(title, description, categoryId, supportTiers,tokenUser.id);
        res.status(201).json({ petitionId });
        return;
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
}
const editPetition = async (req: Request, res: Response): Promise<void> => {
    const validation = await validate(schemas.petition_patch, req.body);
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
        const petitionExist = await petition.petitionExists(petitionId);
        if (!petitionExist) {
            res.statusMessage = "Not Found: No petition found with the provided ID";
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
        const userId = tokenUser.id;
        const userIsOwner = await petition.isOwnerOfPetition(userId, petitionId);
        Logger.info(userIsOwner);
        if (!userIsOwner) {
            res.statusMessage = "Forbidden: Only the owner of a petition may change it";
            res.status(403).send();
            return;
        }

        if(!await petition.isTitleUnique(req.body.title)) {
            res.statusMessage = "Forbidden: Petition title already exists";
            res.status(403).send();
            return;
        }
        const { title, description, categoryId } = req.body;
        Logger.info(req.body);
        await petition.updatePetition(title, description, categoryId, petitionId);
        res.status(200).send();
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
}
const deletePetition = async (req: Request, res: Response): Promise<void> => {
    try {
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
        const isOwner = await petition.isOwnerOfPetition(tokenUser.id, petitionId);
        if (!isOwner) {
            res.statusMessage = "Forbidden: Only the owner of a petition may delete it";
            res.status(403).send();
            return;
        }
        const existingPetitionObject = await petition.getPetitionById(petitionId);
        if (existingPetitionObject.numberOfSupporters > 0) {
            res.statusMessage = "Forbidden: Cannot delete a petition with one or more supporters";
            res.status(403).send();
            return;
        }
        await petition.deletePetition(petitionId);
        res.status(200).send();
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
}
const getCategories = async(req: Request, res: Response): Promise<void> => {
    try{
        const categories = await petition.getAllCategories();
        res.status(200).json(categories);
        return;
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
}

export {getAllPetitions, getPetition, addPetition, editPetition, deletePetition, getCategories};