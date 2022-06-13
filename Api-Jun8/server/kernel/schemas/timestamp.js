module.exports = (schema) => {
  schema.defaults({
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    updatedAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  });

  // Update timestamps
  schema.pre('save', function beforeSave(next) {
    const now = Date.now();
    this.set('updatedAt', now);

    if (this.isNew) {
      this.set('createdAt', now);
    }

    next();
  });
};
