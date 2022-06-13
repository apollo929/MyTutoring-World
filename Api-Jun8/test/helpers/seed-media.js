module.exports = async () => DB.Media.find({})
  .remove()
  .then(async () => {
    const photo = new DB.Media({
      type: 'photo',
      uploaderId: global.admin._id,
      ownerId: global.admin._id,
      name: 'Photo',
      filePath: 'https://gettyimages.ca/gi-resources/images/Homepage/Hero/UK/CMS_Creative_164657191_Kingfisher.jpg',
      mediumPath: 'https://gettyimages.ca/gi-resources/images/Homepage/Hero/UK/CMS_Creative_164657191_Kingfisher.jpg',
      thumbPath: 'https://gettyimages.ca/gi-resources/images/Homepage/Hero/UK/CMS_Creative_164657191_Kingfisher.jpg'
    });

    await photo.save();

    const video = new DB.Media({
      type: 'video',
      uploaderId: global.admin._id,
      ownerId: global.admin._id,
      name: 'Video',
      filePath: 'https://www.w3schools.com/html/mov_bbb.mp4'
    });

    await video.save();

    return {
      video,
      photo
    };
  });
