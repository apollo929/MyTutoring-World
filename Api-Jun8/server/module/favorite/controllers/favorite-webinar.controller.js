const Joi = require('joi');

const validateSchema = Joi.object().keys({
  webinarId: Joi.string().required()
});

exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.favoriteId || req.body.favoriteId;
    if (!id) {
      return next(PopulateResponse.validationError());
    }
    const favorite = await DB.FavoriteWebinar.findOne({ _id: id }).populate('webinar').populate('user');
    if (!favorite) {
      return res.status(404).send(PopulateResponse.notFound());
    }
    req.favorite = favorite;
    res.locals.favorite = favorite;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.favorite = async (req, res, next) => {
  try {
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    const favorite = await Service.FavoriteWebinar.favorite(req.user._id, validate.value);
    res.locals.favorite = favorite;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.unFavorite = async (req, res, next) => {
  try {
    const webinarId = req.params.id || req.params.tutorId;
    const data = await Service.FavoriteWebinar.unFavorite(req.user._id, webinarId);
    res.locals.unFavorite = data;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.list = async (req, res, next) => {
  const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
  const take = parseInt(req.query.take, 10) || 10;

  try {
    const query = Helper.App.populateDbQuery(req.query, {
      text: ['name'],
      equal: ['userId', 'webinarId']
    });

    if (req.user) {
      query.userId = req.user._id;
    }
    query.type = 'webinar';

    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.Favorite.count(query);
    let items = await DB.Favorite.find(query)
      .populate({
        path: 'webinar',
        select: 'name tutorId mainImageId featured lastSlot price description',
        populate: [
          {
            path: 'mainImage'
          },
          {
            path: 'user',
            select: 'name avatarUrl username country featured ratingAvg totalRating avatar'
          }
        ]
      })
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();
    const webinars = items.length
      ? items.map(item => {
          if (item.webinar) {
            item.webinar.user = item.webinar.user.getPublicProfile();
            item = item.toObject();
            item.webinar.isFavorite = true;
            return item.webinar;
          }
        })
      : [];
    res.locals.list = { count, items: webinars };
    next();
  } catch (e) {
    return next(e);
  }
};
