function analysisEvent(body) {
  if (body.payload && body.payload.object && body.payload.object.id) {
    return {
      name: body.event,
      payload: body.payload.object
    };
  }

  return null;
}

exports.hook = async (req, res, next) => {
  try {
    const event = analysisEvent(req.body);
    if (!event) {
      return next();
    }
    if (event.name === 'meeting.started') {
      await Service.Appointment.startMeeting(event.payload);
    }
    if (event.name === 'meeting.ended') {
      await Service.Appointment.endMeeting(event.payload);
    }
    if (event.name === 'recording.completed') {
      await Service.Appointment.getRecording(event.payload.id, event.payload);
    }
    // if (event.name === 'user.created') {
    //   await Service.Tutor.zoomAccountCreated(event.payload);
    // }
    if (event.name === 'user.invitation_accepted') {
      await Service.Tutor.zoomAccountCreated(event.payload);
    }
    if (event.name === 'user.disassociated' || event.name === 'user.deleted') {
      await Service.Tutor.zoomAccountDeleted(event.payload);
    }
    if (event.name === 'user.activated' || event.name === 'user.deactivated') {
      await Service.Tutor.zoomAccountChangeStatus(event.payload, event.name);
    }
    res.locals.hook = {
      success: true
    };
    return next();
  } catch (e) {
    next(e);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await Service.ZoomUs.getUser(req.params.email);
    res.locals.getUser = user;
    return next();
  } catch (e) {
    next(e);
  }
};

exports.inviteUser = async (req, res, next) => {
  try {
    const zoomUser = await Service.ZoomUs.getUser(req.params.email);
    const tutor = await DB.User.findOne({ email: req.params.email });
    if (!tutor) {
      throw new Error('Tutor not found!');
    }
    if (zoomUser && zoomUser.id) {
      if (zoomUser.status === 'active') {
        tutor.isZoomAccount = true;
        tutor.zoomAccountInfo = zoomUser;
        await tutor.save();
      }
    } else {
      await Service.ZoomUs.createUser({ email: tutor.email });
    }
    await Service.Mailer.send('tutor/invite-to-join-zoom.html', tutor.email, {
      subject: `Welcome back to our system.!`,
      tutor: tutor.toObject(),
      appName: process.env.APP_NAME,
      adminEmail: process.env.ADMIN_EMAIL
    });
    res.locals.invite = {
      success: true
    };
    return next();
  } catch (e) {
    next(e);
  }
};
