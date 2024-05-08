import {Request, Response} from "express";
import Logger from "../../config/logger";
import * as userImage from "../models/user.images.model"
import * as users from '../models/user.model';
import logger from "../../config/logger";
import path from "path";
import fs from "fs";
const getImage = async (req: Request, res: Response): Promise<void> => {
    try{
        const userId: number = parseInt(req.params.id,10);
        const user = await userImage.findById(userId);
        if (isNaN(userId)) {
            res.statusMessage = "Bad request: Id not an integer";
            res.status(400).send();
            return;
        }
        if (!user) {
            res.statusMessage = "Not Found. No user with specified ID";
            Logger.info("404")
            res.status(404).send();
            return;
        }
        if(!user.image_filename) {
            res.statusMessage = "Not Found. user has no image";
            Logger.info("404")
            res.status(404).send();
            return;
        }
        let contentType = 'image/png';
        if (user.image_filename.endsWith('.jpg') || user.image_filename.endsWith('.jpeg')) {
            contentType = 'image/jpeg';
        } else if (user.image_filename.endsWith('.gif')) {
            contentType = 'image/gif';
        }
        Logger.info("processed further");
        Logger.info(user.image_filename);
        const absolutePath = path.resolve(__dirname, "../../../storage/images") + "/" + user.image_filename;
        res.status(200).contentType(contentType).sendFile(absolutePath);
        return;
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
}

const setImage = async (req: Request, res: Response): Promise<void> => {
        try{
            const userId: number = parseInt(req.params.id, 10);
            if (isNaN(userId)) {
                res.statusMessage = "Bad request: Id not an integer";
                res.status(400).send();
                return;
            }
            const existingUser = await users.findById(userId);
            if (!existingUser) {
                res.statusMessage = "Not found. No such user with ID given";
                res.status(404).send();
                return;
            }
            const authToken = req.headers["x-authorization"] || req.headers["X-Authorization"] || req.headers["x-Authorization"];
            const tokenUser = await users.findByAuthToken(authToken);
            logger.info(tokenUser);
            if(!authToken || !tokenUser) {
                res.statusMessage = "Unauthorized";
                res.status(401).send();
                return;
            }
            if (tokenUser.id !== userId) {
                res.statusMessage = "Forbidden: Can not change another user's profile photo";
                res.status(403).send();
                return;
            }
            const fileExtension = req.headers["Content-Type"] || req.headers["content-type"];
            logger.info(fileExtension + "fileExtension");
            const allowedExtensions: string[] = ['image/gif', 'image/jpeg', 'image/png'];
            if (!allowedExtensions.includes(fileExtension as string)) {
                res.statusMessage = "Bad Request. Invalid image supplied (possibly incorrect file type)";
                res.status(400).send();
                return;
            }
            let extension;
            if (fileExtension === "image/png") {
                extension = "png";
            } else if (fileExtension === "image/jpeg") {
                extension = "jpg";
            } else if (fileExtension === "image/gif") {
                extension = "gif";
            }

            // Save the image to the storage folder
            const imageDir = path.join(__dirname, '../../../storage/images');
            const imageName = `user_${userId}.${extension}`;
            const imagePath = path.join(imageDir, imageName);

            if(req.body.length === undefined){
                res.statusMessage = "Bad request: no image was passed";
                res.status(400).send();
                return;
            }
            // Writing the image data to the file
            fs.writeFileSync(imagePath, Buffer.from(req.body));
            await userImage.update(userId, imageName);

            const statusMessage = existingUser.image_filename ? "Ok. Image updated" : "Created. New image created";
            res.status(existingUser.image_filename ? 200 : 201).send(statusMessage);
        } catch (err) {
            Logger.error(err);
            res.statusMessage = "Internal Server Error";
            res.status(500).send();
            return;
        }

}

const deleteImage = async (req: Request, res: Response): Promise<void> => {
    try{
        const userId: number = parseInt(req.params.id, 10);
        if (isNaN(userId)) {
            res.statusMessage = "Bad request: Id not an integer";
            res.status(400).send();
            return;
        }
        const existUser = await users.findById(userId);
        if(!existUser) {
            res.statusMessage = "Not found. No such user with ID given";
            res.status(404).send();
            return;
        }

        const authToken = req.headers["x-authorization"] || req.headers["X-Authorization"] || req.headers["x-Authorization"];
        const tokenUser = await users.findByAuthToken(authToken);
        logger.info("tokenUser" + tokenUser);
        if (!authToken || !tokenUser){
            res.statusMessage = "Unauthorized";
            res.status(401).send();
            return;
        }
        if (tokenUser.id !== userId) {
            res.statusMessage = "Forbidden: Can not delete another user's profile photo";
            res.status(403).send();
            return;
        }

        if(!existUser.image_filename) {
            res.statusMessage = "Not Found: No Image found to delete";
            res.status(404).send();
            return;
        }
        const imagePath = path.join(__dirname, '../../../storage/images', existUser.image_filename);

        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

        await userImage.deleteImg(userId);
        res.statusMessage = "OK. Image deleted";
        res.status(200).send()

    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
}

export {getImage, setImage, deleteImage}
