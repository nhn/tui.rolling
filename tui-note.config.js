/* eslint-env es6 */

module.exports = {
  downloads: ({ name, version }) => {
    const dotName = name.replace('-', '.');
    const extensions = ['.js', '.min.js'];
    const result = {};

    extensions.forEach(ext => {
      const filename = name + ext;
      result[filename] = `https://uicdn.toast.com/${dotName}/v${version}/${filename}`;
    });

    return result;
  }
};
