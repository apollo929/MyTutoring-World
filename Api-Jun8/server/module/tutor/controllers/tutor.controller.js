const _ = require('lodash');
const Joi = require('joi');
const dto = require('../dto.js');
const { getLanguageName } = require('../index');
const validateSchema = Joi.object().keys({
  name: Joi.string().required(),
  username: Joi.string().allow([null, '']).optional(),
  email: Joi.string().email().required(),
  password: Joi.string().allow([null, '']).optional(),
  isActive: Joi.boolean().allow(null).optional(),
  emailVerified: Joi.boolean().allow(null).optional(),
  phoneNumber: Joi.string().allow([null, '']).optional(),
  phoneVerified: Joi.boolean().allow(null).optional(),
  address: Joi.string().allow([null, '']).optional(),
  bio: Joi.string().allow([null, '']).optional(),
  subjectIds: Joi.array().items(Joi.string()).allow([null, '']).optional().default([]),
  certificatedTeacher: Joi.boolean().allow(null).optional(),
  languages: Joi.array().items(Joi.string()).optional(),
  grades: Joi.array().items(Joi.string()).optional().default([]),
  timezone: Joi.string().allow([null, '']).optional(),
  isHomePage: Joi.boolean().allow(null).optional(),
  zipCode: Joi.string().allow([null, '']).optional(),
  idYoutube: Joi.string().allow([null, '']).optional(),
  country: Joi.object().allow(null).optional(),
  featured: Joi.boolean().allow(null).optional(),
  gender: Joi.string().allow([null, '']).optional(),
  price1On1Class: Joi.number().allow([null, '']).optional(),
  avatar: Joi.string().allow([null, '']).optional(),
  paypalEmailId: Joi.string().allow([null, '']).optional(),
  commissionRate: Joi.number().allow([null, '']).optional(),
  state: Joi.string().allow([null, '']).optional(),
  city: Joi.string().allow([null, '']).optional(),
  introYoutubeId: Joi.string().allow([null, '']).optional(),
  introVideoId: Joi.string().allow([null, '']).optional()
});
exports.findOne = async (req, res, next) => {
  try {
    const query = Helper.App.isMongoId(req.params.tutorId) ? { _id: req.params.tutorId } : { username: req.params.tutorId };
    let excludeFields = {};
    if ((req.user && req.user.role !== 'admin') || !req.user) {
      excludeFields = {
        zoomAccountInfo: 0,
        availableTimeRange: 0,
        // certificationDocument: 0,
        // resumeDocument: 0,
        // issueDocument: 0,
        commissionRate: 0
      };
    }
    const tutor = await DB.User.findOne(query, excludeFields)
      .populate({
        path: 'education',
        populate: { path: 'document' }
      })
      .populate({
        path: 'experience',
        populate: { path: 'document' }
      })
      .populate({
        path: 'certification',
        populate: { path: 'document' }
      })
      .populate({ path: 'gradeItems', select: '_id name alias' })
      // .populate('issueDocument')
      // .populate('resumeDocument')
      // .populate('certificationDocument')
      .populate({ path: 'categories', select: '_id name alias' })
      .populate('introVideo');
    if (!tutor) {
      return res.status(404).send(PopulateResponse.notFound());
    }
    let myCategories = await DB.MyCategory.find({ tutorId: tutor._id });
    let categories = [];
    if (myCategories.length > 0) {
      await Promise.all(
        myCategories.map(async item => {
          if (item.isActive == true) {
            let cat = await DB.Category.findOne({ _id: item.originalCategoryId });
            if (cat) categories.push(cat);
          }
        })
      );
    }

    let mySubjects = await DB.MySubject.find({ tutorId: tutor._id });
    let subjects = [];
    if (mySubjects.length > 0) {
      await Promise.all(
        mySubjects.map(async item => {
          if (item.isActive == true) {
            let sub = await DB.Subject.findOne({ _id: item.originalSubjectId });
            if (sub) subjects.push(sub);
          }
        })
      );
    }

    req.tutor = tutor;
    let resp = tutor;
    resp.categories = categories;
    resp.subjects = subjects;

    if ((req.user && (req.user.role === 'user' || (req.user.role === 'tutor' && req.user._id.toString() !== tutor._id.toString()))) || !req.user) {
      resp = dto.toResponse(tutor);
    } else {
      resp = dto.toResponse(tutor, true, true);
    }
    if (req.user) {
      const favorite = await DB.Favorite.findOne({ userId: req.user._id, tutorId: resp._id });
      if (favorite) {
        resp.isFavorite = true;
      }
    }
    if (resp.languages && resp.languages.length) {
      resp.languageNames = resp.languages.map(lang => getLanguageName(lang));
    }

    if (resp.country && resp.country.code) {
      resp.country.flag = new URL(`flags-png/${resp.country.code.toLowerCase()}.png`, process.env.baseUrl).href;
    }

    res.locals.tutor = resp;
    return next();
  } catch (e) {
    return next(e);
  }
};

/**
 * Create a new media tutor
 */
exports.create = async (req, res, next) => {
  try {
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const emailCheck = await DB.User.count({ email: validate.value.email });
    if (emailCheck) {
      return next(
        PopulateResponse.error({
          email: 'This email is already in use',
          message: 'This email is already in use'
        })
      );
    }

    let username = req.body.username ? Helper.String.createAlias(req.body.username) : Helper.String.createAlias(req.body.name);
    const count = await DB.User.count({ username });
    if (count) {
      username = `${username}-${Helper.String.randomString(5)}`;
    }
    let countryCode = '';
    if (validate.value.country) {
      countryCode = validate.value.country.code || '';
    }

    const tutor = await Service.User.create(
      Object.assign(req.body, {
        username,
        countryCode,
        type: 'tutor',
        rejected: false,
        pendingApprove: false
      })
    );
    res.locals.tutor = tutor;
    return next();
  } catch (e) {
    return next(e);
  }
};

/**
 * do update for user profile or admin update
 */
exports.update = async (req, res, next) => {
  try {
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    const tutor = req.params.tutorId ? await DB.User.findOne({ _id: req.params.tutorId }) : req.user;
    if (validate.value.email) {
      const emailCheck = await DB.User.count({
        email: validate.value.email,
        _id: { $ne: tutor._id }
      });
      if (emailCheck) {
        return next(
          PopulateResponse.error({
            email: 'Email has already taken',
            message: 'Email has already taken'
          })
        );
      }
    }

    if (validate.value.username) {
      const username = Helper.String.createAlias(validate.value.username);
      const count = await DB.User.count({
        username,
        _id: { $ne: tutor._id }
      });
      if (count) {
        return next(
          PopulateResponse.error({
            username: 'This email is already in use',
            message: 'This email is already in use'
          })
        );
      }

      validate.value.username = username;
    }

    Object.assign(tutor, validate.value);

    if (validate.value.subjectIds) {
      tutor.subjectIds = _.uniq(validate.value.subjectIds);
      tutor.markModified('subjectIds');
    }
    if (validate.value.languages) {
      tutor.languages = _.uniq(validate.value.languages);
      tutor.markModified('languages');
    }
    if (validate.value.grades) {
      tutor.grades = _.uniq(validate.value.grades);
      tutor.markModified('grades');
    }
    if (validate.value.country) {
      tutor.countryCode = validate.value.country.code || '';
    }

    await tutor.save();
    if (validate.value.password) {
      await Service.User.newPassword(tutor, validate.value.password);
    }
    res.locals.update = tutor;
    return next();
  } catch (e) {
    return next();
  }
};

exports.remove = async (req, res, next) => {
  try {
    await req.tutor.remove();
    await Service.ZoomUs.deleteUser({ action: 'delete', email: req.tutor.email });
    res.locals.remove = {
      message: 'Tutor is deleted'
    };
    next();
  } catch (e) {
    next(e);
  }
};

/**
 * get list tutor
 */
exports.list = async (req, res, next) => {
  const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
  const take = parseInt(req.query.take, 10) || 10;

  try {
    const query = Helper.App.populateDbQuery(req.query, {
      text: ['name', 'email', 'zipCode', 'state', 'city'],
      equal: ['isActive', 'isHomePage', 'countryCode'],
      boolean: ['rejected', 'featured', 'pendingApprove']
    });
    query.type = 'tutor';
    if (req.query.subjectIds) {
      const subjectIds = req.query.subjectIds.split(',');
      query.subjectIds = {
        $in: subjectIds
      };
    }

    if (req.query.categoryIds) {
      const categoryIds = req.query.categoryIds.split(',');
      query.categoryIds = {
        $in: categoryIds
      };
    }

    if (req.query.status) {
      if (req.query.status === 'pending') query.pendingApprove = true;
      else {
        if (req.query.status === 'approved') query.rejected = false;
        else query.rejected = true;
        query.pendingApprove = false;
      }
    }
    if (req.query.topicIds) {
      const topicIds = req.query.topicIds.split(',');
      query.topicIds = {
        $in: topicIds
      };
    }

    if (req.query.grade) {
      const grade = req.query.grade.split(',');
      query.grades = {
        $in: grade
      };
    }
    if (!req.user || req.user.role !== 'admin') {
      query.isActive = true;
      query.rejected = false;
      query.emailVerified = true;
      query.isZoomAccount = true;
    }
    if (req.user && req.user._id) {
      query._id = {
        $ne: req.user._id
      };
    }

    if (req.query.rating && parseFloat(req.query.rating)) {
      const num = parseFloat(req.query.rating);
      if (num <= 1.5) {
        query.ratingAvg = {
          $lte: 1.5
        };
      } else {
        const gt = Math.ceil(num) - 0.5;
        const lt = Math.ceil(num) + 0.5;
        query.ratingAvg = {
          $gte: gt,
          $lte: lt
        };
      }
    }

    if (req.query.startTime && req.query.toTime) {
      query.availableTimeRange = {
        $elemMatch: {
          startTime: { $gte: req.query.startTime, $lte: req.query.toTime }
        }
      };
    }
    let excludeFields = {};
    if ((req.user && req.user.role !== 'admin') || !req.user) {
      excludeFields = {
        zoomAccountInfo: 0,
        availableTimeRange: 0,
        certificationDocument: 0,
        resumeDocument: 0,
        issueDocument: 0,
        commissionRate: 0
      };
    }
    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.User.count(query);
    let items = await DB.User.find(query, excludeFields)
      .populate({ path: 'subjects', select: '_id name alias price' })
      .populate({ path: 'gradeItems', select: '_id name alias' })
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();
    if ((req.user && (req.user.role === 'user' || (req.user.role === 'tutor' && req.user._id.toString() !== tutor._id.toString()))) || !req.user) {
      items = items.map(item => {
        const tutor = dto.toResponse(item);
        tutor.languageNames = [];
        if (tutor.languages && tutor.languages.length) {
          tutor.languageNames = tutor.languages.map(key => getLanguageName(key));
        }
        if (tutor.country && tutor.country.code) {
          tutor.country.flag = new URL(`flags-png/${tutor.country.code.toLowerCase()}.png`, process.env.baseUrl).href;
        }
        return tutor;
      });
    } else {
      items = items.map(item => {
        const tutor = dto.toResponse(item, true, true);
        tutor.languageNames = [];
        if (tutor.languages && tutor.languages.length) {
          tutor.languageNames = tutor.languages.map(key => getLanguageName(key));
        }
        if (tutor.country && tutor.country.code) {
          tutor.country.flag = new URL(`flags-png/${tutor.country.code.toLowerCase()}.png`, process.env.baseUrl).href;
        }
        return tutor;
      });
    }
    if (req.user) {
      items = await Promise.all(
        items.map(async item => {
          const favorite = await DB.Favorite.count({
            userId: req.user._id,
            tutorId: item._id
          });
          item.isFavorite = favorite ? true : false;
          return item;
        })
      );
    }

    res.locals.list = {
      count,
      items
    };
    next();
  } catch (e) {
    console.log(e);
    next();
  }
};

exports.changeStatus = async (req, res, next) => {
  try {
    req.tutor.isActive = !req.tutor.isActive;
    await req.tutor.save();
    await DB.Webinar.updateMany(
      {
        tutorId: req.tutor._id
      },
      {
        $set: {
          disabled: req.tutor.isActive ? false : true
        }
      }
    );
    res.locals.changeStatus = { success: true };
    return next();
  } catch (e) {
    return next(e);
  }
};
