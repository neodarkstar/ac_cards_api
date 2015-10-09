module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      workspace: './tmp',
      deployTo: '/opt/apps/amiibo_cards',
      repositoryUrl: 'git@github.com:neodarkstar/ac_cards_api.git',
      branch: 'master',
      ignores: ['.git', 'node_modules'],
      keepReleases: 2,
      deleteOnRollback: false,
      shallowClone: true
    },
    production: {
      servers: 'serveradmin@45.55.226.19'
    }
  });
};
