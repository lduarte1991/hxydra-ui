module.exports = {
  publicPath: process.env.VUE_APP_STATIC_URL,
  assetsDir: 'static/kondo',
  css: {
    extract: { ignoreOrder: true },
  },
  transpileDependencies: [
    'vuetify'
  ],
  pages: {
    'kondo_index': {
      entry: './src/main.js',
      template: 'public/kondo_login.html',
      title: 'Login',
      chunks: ['chunk-vendors', 'chunk-common', 'kondo_index']
    },
    'kondo_projects': {
      entry: './src/pages/kondo_projects/main.js',
      template: 'public/kondo_projects.html',
      title: 'Projects',
      chunks: ['chunk-vendors', 'chunk-common', 'kondo_projects']
    },
    'kondo_create': {
      entry: './src/pages/kondo_create/main.js',
      template: 'public/kondo_create.html',
      title: 'Create Course',
      chunks: ['chunk-vendors', 'chunk-common', 'kondo_create']
    },
    'kondo_choice': {
      entry: './src/pages/kondo_choice/main.js',
      template: 'public/kondo_choice.html',
      title: 'Configure Choice Lists',
      chunks: ['chunk-vendors', 'chunk-common', 'kondo_choice']
    },
    'kondo_reportlist': {
      entry: './src/pages/kondo_reportlist/main.js',
      template: 'public/kondo_reportlist.html',
      title: 'Reports List',
      chunks: ['chunk-vendors', 'chunk-common', 'kondo_reportlist']
    },
    'kondo_customreport': {
      entry: './src/pages/kondo_customreport/main.js',
      template: 'public/kondo_customreport.html',
      title: 'Custom Report',
      chunks: ['chunks-vendors', 'chunk-common', 'kondo_customreport']
    },
    'kondo_reportview': {
      entry: './src/pages/kondo_reportview/main.js',
      template: 'public/kondo_reportview.html',
      title: 'Report View',
      chunks: ['chunk-vendors', 'chunk-common', 'kondo_reportview']
    },
    'kondo_uniqueprojects': {
      entry: './src/pages/kondo_uniqueprojects/main.js',
      template: 'public/kondo_uniqueprojects.html',
      title: 'Unique Projects List',
      chunks: ['chunk-vendors', 'chunk-common', 'kondo_uniqueprojects']
    }
  }
}
