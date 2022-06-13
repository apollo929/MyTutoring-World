const Joi = require('joi');

const validateSchema = Joi.object().keys({
  type: Joi.string().allow(['tutor', 'webinar', 'course']).required(),
  webinarId: Joi.string().allow([null, '']).when('type', {
    is: 'webinar',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  tutorId: Joi.string().allow([null, '']).when('type', {
    is: 'tutor',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  courseId: Joi.string().allow([null, '']).when('type', {
    is: 'course',
    then: Joi.required(),
    otherwise: Joi.optional()
  })
});

exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.favoriteId || req.body.favoriteId;
    const type = req.params.type;
    if (!id || !type) {
      return next(PopulateResponse.validationError());
    }
    const favorite = await DB.Favorite.findOne({ _id: id }).populate(type).populate('user');
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
    const type = req.params.type;
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    if (!type) {
      return next(PopulateResponse.validationError());
    }
    let favorite = null;
    switch (type) {
      case 'webinar':
        favorite = await Service.FavoriteWebinar.favorite(req.user._id, validate.value);
        break;
      case 'course':
        favorite = await Service.FavoriteCourse.favorite(req.user._id, validate.value);
        break;
      case 'tutor':
        favorite = await Service.FavoriteTutor.favorite(req.user._id, validate.value);
        break;
    }
    res.locals.favorite = favorite;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.unFavorite = async (req, res, next) => {
  try {
    const id = req.params.id;
    const type = req.params.type;
    if (!id || !type) {
      return next(PopulateResponse.validationError());
    }
    let data = null;
    switch (type) {
      case 'webinar':
        data = await Service.FavoriteWebinar.unFavorite(req.user._id, id);
        break;
      case 'course':
        data = await Service.FavoriteCourse.unFavorite(req.user._id, id);
        break;
      case 'tutor':
        data = await Service.FavoriteTutor.unFavorite(req.user._id, id);
        break;
    }
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
    const type = req.params.type;
    if (!type) {
      return next(PopulateResponse.validationError());
    }
    query.type = type;
    if (req.user) {
      query.userId = req.user._id;
    }

    const selectData =
      type === 'tutor'
        ? { path: 'tutor', select: 'name avatarUrl username country featured ratingAvg totalRating avatar' }
        : type === 'webinar'
        ? {
            path: 'webinar',
            select: 'name tutorId mainImageId featured lastSlot price description alias',
            populate: [
              {
                path: 'mainImage'
              },
              {
                path: 'tutor',
                select: 'name avatarUrl username country featured ratingAvg totalRating avatar'
              }
            ]
          }
        : {
            path: 'course',
            select: 'name tutorId mainImageId price description alias',
            populate: [
              {
                path: 'mainImage'
              },
              {
                path: 'tutor',
                select: 'name avatarUrl username country featured ratingAvg totalRating avatar'
              }
            ]
          };

    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.Favorite.count(query);
    const items = await DB.Favorite.find(query)
      .populate(selectData)
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();
    let itemsCheckFavorite = [];
    switch (type) {
      case 'webinar':
        itemsCheckFavorite = await Service.FavoriteWebinar.isFavorite(items, req.user._id);
        break;
      case 'course':
        itemsCheckFavorite = await Service.FavoriteCourse.isFavorite(items, req.user._id);
        break;
      case 'tutor':
        itemsCheckFavorite = await Service.FavoriteTutor.isFavorite(items);
        break;
    }
    res.locals.list = { count, items: itemsCheckFavorite };
    next();
  } catch (e) {
    return next(e);
  }
};
