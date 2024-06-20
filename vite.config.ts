export default({
  base: '/html-canvas-playground',
  root: '',
  build: {
    outDir: 'build',
    rollupOptions: {
      input: {
        main: 'index.html',
      },
      watch: {
        include: 'src/scripts/**'
      }
    },
  }
});