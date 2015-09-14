System.config({
  defaultJSExtensions: true,
  transpiler: "traceur",
  paths: {
    "github:*": "src/js/jspm_packages/github/*"
  },

  map: {
    "json": "github:systemjs/plugin-json@0.1.0",
    "olado/doT": "github:olado/doT@1.0.1",
    "reqwest": "github:ded/reqwest@1.1.6",
    "text": "github:systemjs/plugin-text@0.0.2",
    "traceur": "github:jmcriffey/bower-traceur@0.0.91",
    "traceur-runtime": "github:jmcriffey/bower-traceur-runtime@0.0.91"
  }
});
