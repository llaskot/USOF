import {err_resp, success_resp} from "./authController.js";
import {Comment} from "../models/commentModel.js";
import {TokenController} from "./tokenController.js";
import {Like} from "../models/likeModel.js";


export class CommentsController {


    static async get_by_id(req, res) {
        const id = parseInt(req.params.comment_id);
        try {
            const result = await Comment.findById(id);
            if (!result) {
                return res.status(404).json({success:false, error: "Could not find comment with id " + id});
            }
            return res.status(200).send({success: true, comment: result});
        }catch (error) {
            console.error(error);
            return res.status(400).send(err_resp(error.message));
        }
    };

    static async addLike(req, res) {
        const token = TokenController.checkAccess(req.headers);
        if (!token.success) {
            return res.status(403).send(err_resp("Access denied"));
        }
        const comment_id = parseInt(req.params.comment_id);
        let comment_author = await Comment.findById(comment_id, ["author"]);
        if (!comment_author) {
            return res.status(404).send(err_resp("Comment not found"));
        }
        comment_author = comment_author["author"];
        const author = token.payload.id;
        let type = req.body.type;
        let search;
        try {
            search = await Like.find({author: author, comment_id: comment_id});
        } catch (error) {
            console.error(error);
            return res.status(400).send(err_resp(error.message));
        }
        if (search.length > 0) {
            type = !search[0].type;
            try {
                await Comment.likeDelete(comment_id, author, comment_author, type);
                return res.status(200).json(success_resp("your like or dislike deleted"));
            } catch (error) {
                return res.status(400).send(err_resp(error.message));
            }
        }
        try {
            await Comment.like(comment_id, author, comment_author, type);
            return res.status(200).json(success_resp("your like or dislike added"));
        } catch (error) {
            return res.status(400).send(err_resp(error.message));
        }

    };

    static async get_likes(req, res) {
        const comment_id = parseInt(req.params.comment_id);
        try {
            const result = await Like.find({comment_id: comment_id});
            return res.status(200).json({success: true, likes: result});
        } catch (error) {
            console.error(error);
            return res.status(400).send(err_resp(error.message));
        }
    };

    static async update(req, res) {
        const token = TokenController.checkAccess(req.headers);
        if (!token.success) {
            return res.status(403).send(err_resp("Access denied"));
        }
        const comment_id = req.params.comment_id;
        const old_comment = await Comment.findById(comment_id);
        if (!old_comment) {
            return res.status(404).send(err_resp("No such comment"));
        }
        if (token.payload.id !== old_comment["author"]) {
            return res.status(403).send(err_resp("Access denied"));
        }
        const new_comment = new Comment(req.body);
        new_comment.id = comment_id;
        try {
            const result = await new_comment.update(comment_id);
            return res.status(200).send(success_resp(result));

        } catch (error) {
            console.error(error);
            return res.status(400).send(err_resp(error.message));
        }

    }

    static async delete(req, res) {
        const token = TokenController.checkAccess(req.headers);
        if (!token.success) {
            return res.status(403).send(err_resp("Access denied"));
        }
        const comment_id = parseInt(req.params.comment_id);

        let author = await Comment.findById(comment_id, ["author"]);
        if (!author) {
            return res.status(404).send(err_resp("Not found"));
        }
        author = author["author"];

        if (token.payload.role !== "admin" && token.payload.id !== author) {
            return res.status(403).send(err_resp("Access denied"));
        }

        try {
            const result = await Comment.delete(comment_id);
            return res.status(200).send(success_resp(result));
        } catch (error) {
            console.error(error);
            return res.status(400).send(err_resp(error.message));
        }

    };



}