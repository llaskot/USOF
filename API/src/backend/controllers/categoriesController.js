import {TokenController} from "./tokenController.js";
import {err_resp, success_resp} from "./authController.js";
import {Category} from "../models/categoryModel.js";


export class CategoriesController {
    static async create(req, res) {
        const token = TokenController.checkAccess(req.headers);
        if (!token.success) {
            return res.status(403).send(err_resp("Access denied"));
        }
        const category = new Category(req.body);
        try{
            const result = await category.create();
            return res.status(200).send(result);
        } catch (error) {
            return res.status(400).send(err_resp(error));
        }

    };

    static async get_all(req, res) {
        try {
            const categories = await Category.findAll();
            return res.status(200).json({success: true, categories: categories});
        } catch (error) {
            console.error(error);
            return res.status(400).json(err_resp(error.message));
        }
    };

    static async  get_by_id(req, res) {
        const category_id = parseInt(req.params.category_id);
        try {
            const category = await Category.findById(category_id);
            if (!category) {
                return res.status(404).send(err_resp("No such category"));
            }
            return res.status(200).send({success: true, category: category});
        } catch (error) {
            console.error(error);
            return res.status(404).send(err_resp(error.message));
        }

    };

    static async update(req, res) {
        const token = TokenController.checkAccess(req.headers);
        if (!token.success) {
            return res.status(403).send(err_resp("Access denied"));
        }
        const category_id = parseInt(req.params.category_id);
        const category = new Category(req.body);
        try{
            const result = await category.update(category_id);
            return res.status(200).send(result);
        } catch (error) {
            return res.status(400).send(err_resp(error));
        }
    };

    static async delete(req, res) {
        const token = TokenController.checkAccess(req.headers);
        if (!token.success) {
            return res.status(403).send(err_resp("Access denied"));
        }
        const category_id = parseInt(req.params.category_id);
        try {
            const result = await Category.delete(category_id);
            return res.status(200).send(success_resp(result));
        } catch (error) {
            return res.status(400).send(err_resp(error));
        }
    };

    static async get_category_posts(req, res) {
        const category_id = parseInt(req.params.category_id);
        try {
            const result = await Category.get_posts_by_categoryId(category_id);
            if (result.success) {
                return res.status(200).send(result);
            }
            return res.status(404).send(result);
        } catch (error){
            console.error(error);
            return res.status(400).send(err_resp(error.message));
        }

    };



}