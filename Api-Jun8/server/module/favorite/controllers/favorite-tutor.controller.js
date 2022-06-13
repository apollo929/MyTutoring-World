const Joi = require('joi');
const dto = require('../../tutor/dto');
const validateSchema = Joi.object().keys({
  tutorId: Joi.string().required()
});

exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.favoriteId || req.body.favoriteId;
    if (!id) {
      return next(PopulateResponse.validationError());
    }
    const favorite = await DB.FavoriteTutor.findOne({ _id: id }).populate('tutor').populate('user');
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
    const favorite = await Service.FavoriteTutor.favorite(req.user._id, validate.value);
    res.locals.favorite = favorite;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.unFavorite = async (req, res, next) => {
  try {
    const tutorId = req.params.id || req.params.tutorId;
    const data = await Service.FavoriteTutor.unFavorite(req.user._id, tutorId);
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
      equal: ['userId', 'tutorId']
    });
    if (req.user) {
      query.userId = req.user._id;
    }
    query.type = 'tutor';
    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.Favorite.count(query);
    let items = await DB.Favorite.find(query)
      .populate({ path: 'tutor', select: 'name avatarUrl username country featured ratingAvg totalRating avatar' })
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();
    const tutors = items.length
      ? items.map(item => {
          if (item.tutor) {
            item = item.tutor.getPublicProfile();
            item.isFavorite = true;
            return item;
          }
        })
      : [];
    res.locals.list = { count, items: tutors };
    next();
  } catch (e) {
    return next(e);
  }
};
