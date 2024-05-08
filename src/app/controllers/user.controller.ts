import {Request, Response} from "express";
import Logger from '../../config/logger';
import * as user from '../models/user.model';
import logger from "../../config/logger";
import * as schemas from '../resources/schemas.json';
import {validate} from "../resources/validate";
import {hash, compare} from "../services/passwords";
import {randomBytes} from "crypto";
const register = async (req: Request, res: Response): Promise<void> => {
    const validation = await validate(schemas.user_register, req.body);
    if (validation !== true) {
        res.statusMessage = `Bad Request: ${validation.toString()}`;
        res.status(400).send();
        return;
    }
    try {
        logger.info("POST /users/register")
        const {email,firstName,lastName,password}  = req.body;
        const hashedPassword = await hash(password);
        const existingUser = await user.findByEmail(email);
        if (existingUser) {
            res.statusMessage = "Forbidden: Email already in use";
            res.status(403).send();
            return;
        }
        const newUser = await user.create({
            email,
            firstName,
            lastName,
            password: hashedPassword
        });
        res.statusMessage = "Created";
        res.status(201).json({"userId": newUser.insertId});
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
}

const login = async (req: Request, res: Response): Promise<void> => {
    const validation = await validate(schemas.user_login, req.body);
    if (validation !== true) {
        res.statusMessage = `Bad Request: ${validation.toString()}`;
        res.status(400).send();
        return;
    }
    try {
        logger.info("POST /users/login");
        const email = req.body.email;
        const password = req.body.password;
        Logger.info(email);
        Logger.info(password);
        const existingUser = await user.findByEmail(email);
        if (!existingUser) {
            res.statusMessage = "Unauthorized. Incorrect email/password";
            res.status(401).send();
            return;
        }
        const isValidCredentials = await compare(existingUser.password, password);
        logger.info(isValidCredentials);
        if (!isValidCredentials) {
            res.statusMessage = "Unauthorized. Incorrect email/password";
            res.status(401).send();
            return;
        }
        const token = generateRandomToken();
        await user.updateToken(email, token);
        res.status(200).json({ userId: existingUser.id, "token" : token });
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
}

function generateRandomToken(): string {
   const value = randomBytes(16);
   const result = value.toString('hex');
   return result;
}

const logout = async (req: Request, res: Response): Promise<void> => {
    try{
        logger.info("POST /user/logout")
        const authToken = req.headers["x-authorization"] || req.headers["X-Authorization"] || req.headers["x-Authorization"];
        const existingUser = await user.findByAuthToken(authToken);
        if(!authToken || !existingUser) {
            res.statusMessage = "Unauthorized. Cannot log out if you are not authenticated";
            res.status(401).send();
            return;
        }
        await user.invalidateAuthToken(authToken);
        res.statusMessage = "OK";
        res.status(200).send();
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
}

const view = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = parseInt(req.params.id, 10);
        if (isNaN(userId)) {
            res.statusMessage = "Bad Request. Id not a number";
            res.status(400).send();
            return;
        }
        const existingUser = await user.findById(userId);
        if (!existingUser) {
            res.statusMessage = "Not Found. No user with specified ID";
            res.status(404).send();
            return;
        }
        let userData;
        const authToken = req.headers["X-Authorization"] || req.headers["x-authorization"] ;
        logger.info(authToken);
        const userWithId = await user.findByAuthToken(authToken);

        if (userWithId && (userWithId.id === userId))
            userData = {
                email: existingUser.email,
                firstName: existingUser.first_name,
                lastName: existingUser.last_name
            }; else {
            userData = {
                firstName: existingUser.first_name,
                lastName: existingUser.last_name
            };
        }

        res.status(200).json(userData);
    }catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
}


const update = async (req: Request, res: Response): Promise<void> => {
    const validation = await validate(schemas.user_edit,req.body);
    if (validation !== true) {
        res.statusMessage = `Bad Request: ${validation.toString()}`;
        res.status(400).send();
        return;
    }
    try {
        const userId = parseInt(req.params.id, 10);
        if (isNaN(userId)) {
            res.statusMessage = "Bad Request. Id not a number";
            res.status(400).send();
            return;
        }

        const currentUser = await user.findById(userId);
        if (!currentUser) {
            res.statusMessage = "Not Found";
            res.status(404).send();
            return;
        }
        const authToken = req.headers["x-authorization"] || req.headers["X-Authorization"] || req.headers["x-Authorization"];
        const tokenUser = await user.findByAuthToken(authToken);
        if(!authToken || !tokenUser) {
            res.statusMessage = "Unauthorized";
            res.status(401).send();
            return;
        }
        if (tokenUser.id !== userId) {
            res.statusMessage = "Forbidden: Can not edit another user's information";
            res.status(403).send();
            return;
        }
        const email = req.body.email;
        if (req.body.hasOwnProperty("email")) {
            const existingUserWithEmail = await user.findByEmail(email);
            if (existingUserWithEmail && existingUserWithEmail.id !== userId) {
                res.statusMessage = "Forbidden. Email is already in use";
                res.status(403).send();
                return;
            }
        }
        const password = req.body.password;
        const currentPassword = req.body.currentPassword;
        const hasPassword = req.body.hasOwnProperty("password");
        const hasCurrentPassword = req.body.hasOwnProperty("currentPassword");
        if(hasPassword || hasCurrentPassword) {
            if ((hasPassword && hasCurrentPassword)) {
                logger.info("password and currentPassword found")
                logger.info(currentUser);
                const isValidPassword = await compare(currentUser.password, currentPassword);
                if (!isValidPassword) {
                    res.statusMessage = "Unauthorized: Invalid current password.";
                    res.status(401).send();
                    return;
                } else if (currentPassword === password) {
                    res.statusMessage = "Forbidden: Current password and new password must not be the same.";
                    res.status(403).send();
                    return;
                }
            } else {
                res.statusMessage = "Bad Request: Both currentPassword and password are required for password update";
                res.status(400).send();
                return;
            }
        }
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;

        const updatedFields = {email , firstName, lastName, password: currentUser.password};
        if (password) {
            updatedFields.password = await hash(password);
        }
        if(email) {
            updatedFields.email = email;
        }
        if(firstName) {
            updatedFields.firstName = firstName;
        }
        if(lastName) {
            updatedFields.lastName = lastName;
        }

        await user.updateUser(userId, updatedFields);
        res.statusMessage ="OK";
        res.status(200).send();
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
}

export {register, login, logout, view, update}