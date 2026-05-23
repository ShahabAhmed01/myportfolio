/* Bump assetVersion when you replace profile-photo.jpg — everyone gets the new photo automatically */
window.SITE = {
    profilePhoto: 'profile-photo.jpg',
    assetVersion: '2'
};

window.profilePhotoUrl = function () {
    return SITE.profilePhoto + '?v=' + SITE.assetVersion;
};

window.PORTFOLIO_CONFIG = {
    githubUsername: 'ShahabAhmed01',
    pinnedRepos: [
        'Simple-ATM-Simulation',
        'AuraTimer',
        'To-Do-List-Application',
        'Number-Guessing-Game',
        'Dice-Rolling-Game',
        'UMT'
    ],
    currentSemester: 4,
    location: null,
    skills: [
        { name: 'C++', level: 'advanced' },
        { name: 'Python', level: 'intermediate' },
        { name: 'HTML5', level: 'advanced' },
        { name: 'CSS3', level: 'advanced' },
        { name: 'JavaScript', level: 'intermediate' },
        { name: 'Bootstrap', level: 'advanced' },
        { name: 'Database', level: 'intermediate' },
        { name: 'OOP', level: 'advanced' },
        { name: 'DSA', level: 'intermediate' },
        { name: 'Git & GitHub', level: 'advanced' }
    ]
};
