/* Bump assetVersion when you replace profile-photo.jpg — everyone gets the new photo automatically */
window.SITE = {
    profilePhoto: 'profile-photo.jpg',
    assetVersion: '2'
};

window.profilePhotoUrl = function () {
    return SITE.profilePhoto + '?v=' + SITE.assetVersion;
};
