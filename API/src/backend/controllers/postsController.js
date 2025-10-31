import {TokenController} from "./tokenController.js";
import {err_resp, success_resp} from "./authController.js";
import {Post} from "../models/postModel.js";
import {Like} from "../models/likeModel.js";
import {Comment} from "../models/commentModel.js";


export class PostsController {

    static async create(req, res) {
        const token = TokenController.checkAccess(req.headers);
        if (!token.success) {
            return res.status(403).send(err_resp("Access denied"));
        }
        const post = new Post(req.body);
        if (!post.categories || !post.categories.length) {
            return res.status(400).send(err_resp("Category must have"));
        }
        post.author = token.payload.id;
        try {
            const result = await post.create_with_category();
            return res.status(200).send(result);
        } catch (error) {
            return res.status(400).send(err_resp(error.message));
        }

    };


    static async get_all(req, res) {
        const filters = {date: {}, category_id: [], inactive: false, allCategory: false, my_own: false};
        const pagination = {page: 1, limit: 5}
        let sorts = [];
        filters.date.from = req.query.date_from || null;
        filters.date.to = req.query.date_to || null;
        filters.category_id = req.query.category_id || null;
        filters.my_own = req.query.my_own === "false" ? null : req.query.my_own;
        filters.inactive = (req.query.inactive === "true" || req.query.inactive === "1");
        filters.allCategory = (req.query.allCategory === "true" || req.query.allCategory === "1")
        sorts[0] = req.query.sort0 || null;
        sorts[1] = req.query.sort1 || null;
        pagination.page = req.query.page || 1;
        pagination.limit = req.query.limit || 5;


        try {
            const posts = await Post.findByFilters(filters, sorts, pagination);
            const totalFilteredPosts = await Post.findByFilters(filters, sorts);

            return res.status(200).json({
                success: true,
                posts: posts,
                total: totalFilteredPosts.length,
                page: Number(pagination.page),
                limit: Number(pagination.limit)
            });
        } catch (error) {
            console.error(error);
            return res.status(400).json(err_resp(error.message));
        }
    };


    static async get_by_id(req, res) {
        const post_id = parseInt(req.params.post_id);
        try {
            const post = await Post.findById(post_id);
            if (!post) {
                return res.status(404).send(err_resp("No such post"));
            }
            return res.status(200).send({success: true, post: post});
        } catch (error) {
            console.error(error);
            return res.status(404).send(err_resp(error.message));
        }

    };


    static async get_post_categories(req, res) {
        const post_id = parseInt(req.params.post_id);
        try {
            const result = await Post.post_categories(post_id);
            if (result.length === 0) {
                return res.status(404).send(err_resp("Categories not found"));
            }
            return res.status(200).json({success: true, categories: result});
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
        const post_id = req.params.post_id;
        const old_post = await Post.findById(post_id);
        if (!old_post) {
            return res.status(404).send(err_resp("No such post"));
        }
        if (token.payload.id !== old_post["author"]) {
            if (token.payload.role !== "admin"){
                return res.status(403).send(err_resp("Access denied"));
            }
            delete (req.body.content)
        }
        const new_post = new Post(req.body);
        new_post.id = post_id;
        if (new_post["categories"] && new_post["categories"].length > 0) {
            try {
                const result = await new_post.update_with_categories(post_id, new_post);
                return res.status(200).send(success_resp(result));
            } catch (error) {
                return res.status(400).send(err_resp(error.message));
            }
        } else try {
            const result = await new_post.update(post_id);
            return res.status(200).send(success_resp(result));

        } catch (error) {
            console.error(error);
            return res.status(400).send(err_resp(error.message));
        }

    };


    static async delete(req, res) {
        const token = TokenController.checkAccess(req.headers);
        if (!token.success) {
            return res.status(403).send(err_resp("Access denied"));
        }
        const post_id = parseInt(req.params.post_id);

        let author = await Post.findById(post_id, ["author"]);
        if (!author) {
            return res.status(404).send(err_resp("Not found"));
        }
        author = author["author"];

        if (token.payload.role !== "admin" && token.payload.id !== author) {
            return res.status(403).send(err_resp("Access denied"));
        }

        try {
            const result = await Post.delete(post_id);
            return res.status(200).send(success_resp(result));
        } catch (error) {
            console.error(error);
            return res.status(400).send(err_resp(error.message));
        }

    };


    static async add_like(req, res) {
        const token = TokenController.checkAccess(req.headers);
        if (!token.success) {
            return res.status(403).send(err_resp("Access denied"));
        }
        const post_id = parseInt(req.params.post_id);
        let post_author = await Post.findById(post_id, ["author"]);
        if (!post_author) {
            return res.status(404).send(err_resp("Post not found"));
        }
        post_author = post_author["author"];
        const author = token.payload.id;
        let type = req.body.type;
        let search;
        try {
            search = await Like.find({author: author, post_id: post_id});
        } catch (error) {
            console.error(error);
            return res.status(400).send(err_resp(error.message));
        }
        if (search.length > 0) {
            type = !search[0].type;
            try {
                await Post.likeDelete(post_id, author, post_author, type);
                return res.status(200).json(success_resp("your like or dislike deleted"));
            } catch (error) {
                return res.status(400).send(err_resp(error.message));
            }
        }
        try {
            await Post.like(post_id, author, post_author, type);
            return res.status(200).json(success_resp("your like or dislike added"));
        } catch (error) {
            return res.status(400).send(err_resp(error.message));
        }

    };


    static async get_likes(req, res) {
        const post_id = parseInt(req.params.post_id);
        try {
            const result = await Like.find({post_id: post_id});
            return res.status(200).json({success: true, likes: result});
        } catch (error) {
            console.error(error);
            return res.status(400).send(err_resp(error.message));
        }
    };


    static async add_comment(req, res) {
        const token = TokenController.checkAccess(req.headers);
        if (!token.success) {
            return res.status(403).send(err_resp("Access denied"));
        }

        const post_id = parseInt(req.params.post_id);
        req.body["author"] = token.payload.id;
        req.body["post_id"] = post_id;

        const comment = new Comment(req.body);
        try {
            const result = await comment.create();
            return res.status(200).send({success: true, comment: result});
        } catch (error) {
            console.error(error);
            return res.status(400).send(err_resp(error.message));
        }
    };


    static async get_comment(req, res) {
        const post_id = parseInt(req.params.post_id);
        try {
            const result = await Comment.find({post_id: post_id});
            if (result.length > 0) {
                return res.status(200).send({success: true, comment: result});
            } else return res.status(404).send(err_resp("comments not found"));
        } catch (error) {
            console.error(error);
            return res.status(400).send(err_resp(error.message));
        }
    };

    static async get_search(req, res){
        if (req.query.word.length < 3) {
            return res.status(400).json(err_resp("At least 3 characters long"));
        }
        try {
            const result = await Post.search(req.query.word);
            return res.status(200).json({success: true, posts: result});


        } catch (error) {
            console.error(error);
            return res.status(400).send(err_resp(error.message));
        }

    };



}