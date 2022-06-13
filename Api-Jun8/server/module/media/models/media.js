/* eslint no-param-reassign: 0 */
const Schema = require('mongoose').Schema;

const schema = new Schema(
  {
    // uploader or owner?
    uploaderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    name: {
      type: String
    },
    description: {
      type: String
    },
    type: {
      type: String,
      index: true
    },
    systemType: {
      type: String,
      index: true
    },
    convertStatus: {
      type: String,
      enum: ['pending', 'processing', 'done', 'failed'],
      default: 'done'
    },
    mimeType: {
      type: String
    },
    uploaded: {
      type: Boolean,
      default: true
    },
    categoryIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'MediaCategory'
      }
    ],
    // create thumb, medium and large photo - optimize for speed
    originalPath: {
      type: String
    },
    filePath: {
      type: String
    },
    mediumPath: {
      type: String
    },
    thumbPath: {
      type: String
    },
    meta: {
      type: Schema.Types.Mixed
    },
    duration: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date
    },
    updatedAt: {
      type: Date
    }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true,
      transform(doc, ret) {
        ret.fileUrl = ret.filePath ? Helper.App.getPublicFileUrl(ret.filePath) : ret.originalPath;
        ret.mediumUrl = Helper.App.getPublicFileUrl(ret.mediumPath);
        ret.thumbUrl = Helper.App.getPublicFileUrl(ret.thumbPath);
      }
    }
  }
);

schema.virtual('fileUrl').get(() => (this.filePath ? Helper.App.getPublicFileUrl(this.filePath) : this.originalPath));

schema.virtual('mediumUrl').get(() => Helper.App.getPublicFileUrl(this.mediumPath));

schema.virtual('thumbUrl').get(() => Helper.App.getPublicFileUrl(this.thumbPath));

schema.method('toJSON', function toJSON() {
  const data = this.toObject();

  delete data.filePath;
  delete data.mediumPath;
  delete data.thumbPath;
  delete data.originalPath;

  return data;
});

schema.method('getPublic', function getPublic() {
  const data = this.toObject();
  delete data.filePath;
  delete data.mediumPath;
  delete data.thumbPath;
  delete data.originalPath;

  return data;
});

module.exports = schema;
