import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { Utils } from 'nk-js-library';

import { Middlewares } from 'nk-node-library';

import { RefreshTokenService } from '../services';

const app: express.Application = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(Middlewares.logger('v1'));
app.use(Middlewares.requestProcessor(RefreshTokenService));

Utils.GoogleGeocoderUtils.loadAPI('AIzaSyDl4dmvk0tBIX0-BWCaOZy0MjAcTtLHo60');

Utils.MailerUtils.loadMailerAPI('starlight.mailer.service@gmail.com', 'Mailer@Starlight*com');

export default app;