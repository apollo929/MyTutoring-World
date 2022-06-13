const _ = require('lodash');
const Joi = require('joi');

const validateSchema = Joi.object().keys({
    title: Joi.string().required(),
    alias: Joi.string()
        .allow([null, ''])
        .optional(),
    content: Joi.string()
        .allow([null, ''])
        .optional(),
    ordering: Joi.number()
        .allow([null, ''])
        .optional(),
    categoryIds: Joi.array()
        .items(Joi.string())
        .optional()
        .default([]),
    type: Joi.string()
        .allow([null, ''])
        .optional()
        .default('post')
});

exports.findOne = async(req, res, next) => {
    try {
        const id = req.params.id || req.params.postId || req.body.postId;
        if (!id) {
            return next(PopulateResponse.validationError());
        }
        const query = Helper.App.isMongoId(id) ? { _id: id } : { alias: id };
        const post = await DB.Post.findOne(query);
        if (!post) {
            return res.status(404).send(PopulateResponse.notFound());
        }

        req.post = post;
        res.locals.post = post;
        return next();
    } catch (e) {
        return next(e);
    }
};

/**
 * Create a new media post
 */
exports.create = async(req, res, next) => {
    try {
        const validate = Joi.validate(req.body, validateSchema);
        if (validate.error) {
            return next(PopulateResponse.validationError(validate.error));
        }

        let alias = req.body.alias ? Helper.String.createAlias(req.body.alias) : Helper.String.createAlias(req.body.name);
        const count = await DB.Post.count({ alias });
        if (count) {
            alias = `${alias}-${Helper.String.randomString(5)}`;
        }

        const post = new DB.Post(
            Object.assign(validate.value, {
                alias
            })
        );
        await post.save();
        res.locals.post = post;
        return next();
    } catch (e) {
        return next(e);
    }
};

/**
 * do update for user profile or admin update
 */
exports.update = async(req, res, next) => {
    try {
        const validate = Joi.validate(req.body, validateSchema);
        if (validate.error) {
            return next(PopulateResponse.validationError(validate.error));
        }

        let alias = req.body.alias ? Helper.String.createAlias(req.body.alias) : Helper.String.createAlias(req.body.name);
        const count = await DB.Post.count({
            alias,
            _id: { $ne: req.post._id }
        });
        if (count) {
            alias = `${alias}-${Helper.String.randomString(5)}`;
        }

        _.merge(req.post, validate.value);
        if (req.body.categoryIds) {
            req.post.categoryIds = req.body.categoryIds;
        }
        await req.post.save();
        res.locals.update = req.post;
        return next();
    } catch (e) {
        return next();
    }
};

exports.remove = async(req, res, next) => {
    try {
        await req.post.remove();
        res.locals.remove = {
            message: 'Post is deleted'
        };
        next();
    } catch (e) {
        next(e);
    }
};

/**
 * get list post
 */
exports.list = async(req, res, next) => {
    const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
    const take = parseInt(req.query.take, 10) || 10;

    try {
        const query = Helper.App.populateDbQuery(req.query, {
            text: ['title', 'alias', 'content'],
            equal: ['type']
        });

        const sort = Helper.App.populateDBSort(req.query);
        const count = await DB.Post.count(query);
        const items = await DB.Post.find(query)
            // .collation({ locale: 'en' })
            .sort(sort)
            .skip(page * take)
            .limit(take)
            .exec();

        res.locals.list = {
            count,
            items
        };
        next();
    } catch (e) {
        next();
    }
};