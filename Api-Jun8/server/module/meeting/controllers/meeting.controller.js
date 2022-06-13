// const HttpStatus = require('http-status-codes');
const { StatusCodes } = require('http-status-codes');
exports.startMeeting = async (req, res, next) => {
  try {
    const appointmentId = req.params.appointmentId;
    if (req.user.type !== 'tutor') {
      return next(PopulateResponse.forbidden());
    }
    const tutorId = req.user._id;
    const appointment = await DB.Appointment.findOne({ _id: appointmentId, tutorId, status: { $in: ['booked', 'pending', 'progressing'] } }).populate(
      {
        path: 'transaction',
        select: req.user.role !== 'admin' ? '-commission -balance' : ''
      }
    );
    if (!appointment) {
      return next(
        PopulateResponse.error(
          {
            message: `Can't start this meeting`
          },
          'ERR_CAN_NOT_START_MEETING'
        )
      );
    }
    const isBeforeStartTime = await Service.Appointment.isBeforeStartTime(appointment);
    if (isBeforeStartTime) {
      return next(
        PopulateResponse.error({
          message: `Unable to start meeting before the specified time.`
        })
      );
    }
    // const signature = await Service.Meeting.generateSignature({
    //   meetingNumber: appointment.meetingId,
    //   role: 1
    // });
    if (!appointment.zoomData || (appointment.zoomData && !appointment.zoomData.start_url)) {
      const zoomData = await Service.ZoomUs.createMeeting({
        email: req.user.email
      });
      if (zoomData || zoomData.start_url) {
        appointment.zoomData = zoomData;
        appointment.meetingId = zoomData.id;
        await appointment.save();
      } else {
        return next(
          PopulateResponse.error({
            message: `Can't not start meeting.`
          })
        );
      }
      if (appointment.targetType === 'webinar') {
        const appointments = await DB.Appointment.find({
          status: { $in: ['booked', 'pending', 'progressing'] },
          slotId: appointment.slotId
        });
        if (appointments && appointments.length) {
          for (const a of appointments) {
            a.zoomData = zoomData;
            a.meetingId = zoomData.id;
            await a.save();
          }
        }
      }
    } else if (appointment.zoomData && appointment.zoomData.start_url) {
      const appointments = await DB.Appointment.find({
        status: { $in: ['booked', 'pending', 'progressing'] },
        slotId: appointment.slotId
      });
      if (appointments && appointments.length) {
        for (const a of appointments) {
          a.zoomData = appointment.zoomData;
          a.meetingId = appointment.zoomData.id;
          await a.save();
        }
      }
    }
    const data = appointment.toObject();
    if (
      data.zoomData &&
      data.zoomData.start_url &&
      data.transaction &&
      data.transaction.paid &&
      !data.transaction.isRefund &&
      data.status !== 'canceled' &&
      data.status !== 'not-start'
    ) {
      data.zoomUrl = data.zoomData.start_url;
    }
    delete data.zoomData;
    // TODO - validate permission?
    res.locals.signature = data;
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.joinMeeting = async (req, res, next) => {
  try {
    const appointmentId = req.params.appointmentId;
    const appointment = await DB.Appointment.findOne({ _id: appointmentId, status: { $in: ['pending', 'progressing'] } }).populate({
      path: 'transaction',
      select: req.user.role !== 'admin' ? '-commission -balance -paymentInfo' : ''
    });
    if (req.user.type !== 'student' && req.user._id.toString() !== appointment.userId.toString()) {
      return next(PopulateResponse.forbidden());
    }
    if (!appointment) {
      return next(
        PopulateResponse.error(
          {
            message: `Can't start this meeting`
          },
          'ERR_CAN_NOT_START_MEETING'
        )
      );
    }

    const isBeforeStartTime = await Service.Appointment.isBeforeStartTime(appointment);
    if (isBeforeStartTime) {
      return next(
        PopulateResponse.error({
          message: `Unable to join meeting before the specified time.`
        })
      );
    }
    if (!appointment.zoomData || !appointment.zoomData.start_url) {
      return next(
        PopulateResponse.error({
          message: `The tutor hasn't started meeting yet.`
        })
      );
    }

    // const signature = await Service.Meeting.generateSignature({
    //   meetingNumber: appointment.meetingId,
    //   role: 0
    // });
    const data = appointment.toObject();
    if (
      data.zoomData &&
      data.zoomData.start_url &&
      data.transaction &&
      data.transaction.paid &&
      !data.transaction.isRefund &&
      data.status !== 'canceled' &&
      data.status !== 'not-start'
    ) {
      data.zoomUrl = data.zoomData.join_url;
    }
    delete data.zoomData;
    // TODO - validate permission?
    res.locals.signature = data;
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.permissionCheck = async (req, res, next) => {
  try {
    console.log('check-permission', req.user.name);
    const valid = true;
    res.sendStatus(valid ? StatusCodes.OK : StatusCodes.UNAUTHORIZED);
  } catch (e) {
    console.log(e);
    return next(e);
  }
};
