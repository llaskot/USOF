import {Post} from "./postModel.js";

const a = await Post.findByFilters({date: {to: "2025-09-15 19:23:45"},
     category_id: [1,2], inactive: true, allCategory: true}, ['dateASC', 'likeASC']);

console.log(a)
console.log(a.length)
