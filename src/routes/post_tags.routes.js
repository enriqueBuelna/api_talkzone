import {Router} from 'express';
import { createPostTag, deletePostTag } from '../controllers/post_tags.controllers.js';

const router = Router();

// Ruta para crear una relación entre un post y un tag
router.post('/post-tags', createPostTag);

// Ruta para eliminar una relación entre un post y un tag
router.delete('/post-tags/:post_id/:tag_id', deletePostTag);

export default router;
