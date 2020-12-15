import { Router } from 'express';
import { Middlewares } from 'nk-node-library';
import { TagController } from '../controllers';

const router = Router()

const controller = new TagController();

router.post('/search',Middlewares.authCheck(false),controller.getAll)
router.get('/:id',Middlewares.authCheck(false),controller.get)

export default router;