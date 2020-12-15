import { Router } from 'express';
import { Middlewares,Services } from 'nk-node-library';
import { CommentController } from '../controllers';
import OpinionRoutes from './opinion.routes';

const router = Router()

const controller = new CommentController();

const authorService : Services.AuthorService = <Services.AuthorService> (controller.service);

const validatorMiddleware = new Middlewares.ValidatorMiddleware();

const schema = {
    "type": "object",
    "additionalProperties": false,
    "required": ["content","context"],
    "properties": {
        "content":{
            "type":"string"
        },
        "context":{
            "type":"string",
            "enum": ['general','update','resolve']
        },
        "location":{
            "type":"object",
            "additionalProperties": true,
            "required": ["latitude","longitude"],
            "properties":{
                "latitude":{
                    "type":"number"
                },
                "longitude":{
                    "type":"number"
                },
                "raw":{
                    "type":"object"
                }
            }
        }
    }
};

router.param('id',Middlewares.addParamToRequest());

router.param('postId',Middlewares.addParamToRequest());
router.param('commentId',Middlewares.addParamToRequest());

router.post('/',
            Middlewares.authCheck(true,true),
            validatorMiddleware.validateRequestBody(schema),
            controller.create);

router.post('/search',
            Middlewares.authCheck(false),
            controller.getAll)

router.get('/:id',
            Middlewares.authCheck(false),
            Middlewares.checkDocumentExists(authorService,'id'),
            controller.get)

router.put('/:id',
            Middlewares.authCheck(true,true),
            Middlewares.checkDocumentExists(authorService,'id'),
            Middlewares.isAuthor(authorService),
            validatorMiddleware.validateRequestBody(schema),
            controller.update)

router.delete('/:id',
            Middlewares.authCheck(true,true),
            Middlewares.checkDocumentExists(authorService,'id'),
            Middlewares.isAuthor(authorService),
            controller.delete)


router.use('/:commentId/opinion',
            Middlewares.checkDocumentExists(authorService,'commentId'),
            OpinionRoutes);

export default router;