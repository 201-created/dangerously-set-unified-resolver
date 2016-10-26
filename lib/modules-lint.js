// TEST notes
// The following repos have examples on testing broccoli plugins,
// test helpers, how to use fixtures and stub out console.log
// https://github.com/rwjblue/broccoli-jshint
// https://github.com/stefanpenner/broccoli-stew
// https://github.com/rwjblue/broccoli-fixturify

var Plugin = require('broccoli-plugin');
var path = require('path');
var walkSync = require('walk-sync');
// Create a subclass MyPlugin derived from Plugin
MyPlugin.prototype = Object.create(Plugin.prototype);
MyPlugin.prototype.constructor = MyPlugin;
function MyPlugin(inputNode, options) {
  options = options || {};
  Plugin.call(this, [inputNode], {
    annotation: options.annotation

  });
  this.options = options;

}

MyPlugin.prototype.build = function() {
  // Read files from this.inputPaths, and write files to this.outputPath.
  // Silly example:

  // Read 'foo.txt' from the third input node
  // var inputBuffer = fs.readFileSync(path.join(this.inputPaths[2], 'foo.txt'));
  // var outputBuffer = someCompiler(inputBuffer);
  // // Write to 'bar.txt' in this node's output
  // fs.writeFileSync(path.join(this.outputPath, 'bar.txt'), outputBuffer);

  var appPath = this.inputPaths[0];
  var files = walkSync(appPath);
  console.log('in the plugin');
  console.log(files[0]);
}

module.exports = MyPlugin;
