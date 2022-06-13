/* eslint no-restricted-syntax: 0, no-await-in-loop: 0 */
module.exports = async () => {
  try {
    await DB.User.updateMany(
      { type: 'tutor' },
      {
        pendingApprove: false
      }
    );

    const applicationFee = new DB.Config({
      key: 'applicationFee',
      type: 'number',
      value: 0.2,
      name: 'Transaction fee setting',
      description: 'Enter decimal number, from 0 - 1. Value 0.2 means admin will get 20% on the booking',
      public: true,
      ordering: 11
    });
    await applicationFee.save();
  } catch (e) {
    throw e;
  }
};
