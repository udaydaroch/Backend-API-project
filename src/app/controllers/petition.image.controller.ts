import { Request, Response } from "express";
import Logger from "../../config/logger";
import * as petitions from '../models/petition.model';
import * as users from '../models/user.model';
import path from "path";
import fs from "fs";

const getImage = async (req: Request, res: Response): Promise<void> => {
    try {
        const petitionId: number = parseInt(req.params.id, 10);
        if (isNaN(petitionId)) {
            res.statusMessage = "Bad request: Id not an integer";
            res.status(400).send();
            return;
        }

        // Assuming getPetitionById includes image_filename in its response
        const petition = await petitions.getPetition(petitionId);
        if (!petition) {
            res.statusMessage = "Not Found. No petition with specified ID";
            res.status(404).send();
            return;
        }
        Logger.info(petition);
        if(!petition.image_filename) {
            res.statusMessage = "Not Found. Petition has no image";
            res.status(404).send();
            return;
        }
        Logger.info(petition.image_filename);

        let contentType = 'image/png'; // Default to PNG
        if (petition.image_filename.endsWith('.jpg') || petition.image_filename.endsWith('.jpeg')) {
            contentType = 'image/jpeg';
        } else if (petition.image_filename.endsWith('.gif')) {
            contentType = 'image/gif';
        }

        Logger.info(petition.image_filename);
        const imagesDir = path.resolve(__dirname, "../../../storage/images");
        const absolutePath = path.join(imagesDir, petition.image_filename);
        Logger.info(absolutePath);
        if (fs.existsSync(absolutePath)) {
            res.status(200).contentType(contentType).sendFile(absolutePath);
        } else {
            res.statusMessage = "File not found";
            res.status(404).send();
        }
        return;

    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
};

const setImage = async (req: Request, res: Response): Promise<void> => {
    try {
        const petitionId = parseInt(req.params.id, 10);
        // Retrieve the auth token from the request headers
        const authToken = req.headers["x-authorization"] || req.headers["X-Authorization"];

        if (isNaN(petitionId)) {
            res.statusMessage = "Bad request: Id not an integer";
            res.status(400).send();
            return;
        }
        if (!authToken) {
            res.statusMessage = "Unauthorized: No auth token provided";
            res.status(401).send();
            return;
        }

        // Find the user by their auth token
        const user = await users.findByAuthToken(authToken);
        if (!user) {
            res.statusMessage = "Unauthorized: Invalid auth token";
            res.status(401).send();
            return;
        }

        const petition = await petitions.getPetition(petitionId);
        if (!petition) {
            res.statusMessage = "Not Found. No petition with specified ID";
            res.status(404).send();
            return;
        }


        if (petition.owner_id !== user.id) {
            res.statusMessage = "Forbidden. Only the owner of a petition can change the hero image";
            res.status(403).send();
            return;
        }

        const contentType = req.headers["content-type"];
        const validTypes = ["image/png", "image/jpeg", "image/gif"];
        if (!validTypes.includes(contentType)) {
            res.statusMessage = "Unsupported Media Type. Only PNG, JPEG, and GIF are allowed";
            res.status(400).send();
            return;
        }
        if(req.body.length === undefined) {
            res.statusMessage = "Bad Request: No image data provided";
            res.status(400).send();
            return;
        }
        const imagePath = path.join(__dirname, "../../../storage/images", `petition_${petitionId}.${contentType.split("/")[1]}`);
        fs.writeFileSync(imagePath, Buffer.from(req.body));

        const newImageFilename = `petition_${petitionId}.${contentType.split("/")[1]}`;
        await petitions.updatePetitionImage(petitionId, newImageFilename);

        const statusCode = petition.image_filename ? 200 : 201;
        res.status(statusCode).send();

    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
};

export {getImage, setImage};