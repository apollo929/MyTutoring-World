/* eslint prefer-arrow-callback: 0 */
const _ = require('lodash');

// exports.User = (schema) => {
//   schema.pre('save', function beforeSaveHook(next) {
//     this._createZoomus = this.isModified('emailVerified') && this.emailVerified && this.type === 'tutor';
//     next();
//   });
//   schema.post('save', async function afterSaveHook(doc, next) {
//     try {
//       if (doc._createZoomus) {
//         await Service.ZoomUs.createUser({
//           email: doc.email
//         });
//       }
//       next();
//     } catch (e) {
//       next();
//     }
//   });
// };
