Node.js v22.15.1
[nodemon] app crashed - waiting for file changes before starting...
[nodemon] restarting due to changes...
[nodemon] starting `node server.js`
C:\Users\cybel\OneDrive\Desktop\advert-platform-backend\node_modules\mongoose\lib\mongoose.js:610
      throw new _mongoose.Error.OverwriteModelError(name);
      ^

OverwriteModelError: Cannot overwrite `User` model once compiled.
    at Mongoose.model (C:\Users\cybel\OneDrive\Desktop\advert-platform-backend\node_modules\mongoose\lib\mongoose.js:610:13)
    at Object.<anonymous> (C:\Users\cybel\OneDrive\Desktop\advert-platform-backend\models\user.js:52:27)   
    at Module._compile (node:internal/modules/cjs/loader:1730:14)
    at Object..js (node:internal/modules/cjs/loader:1895:10)
    at Module.load (node:internal/modules/cjs/loader:1465:32)
    at Function._load (node:internal/modules/cjs/loader:1282:12)
    at TracingChannel.traceSync (node:diagnostics_channel:322:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:235:24)
    at Module.require (node:internal/modules/cjs/loader:1487:12)
    at require (node:internal/modules/helpers:135:16)

Node.js v22.15.1
[nodemon] app crashed - waiting for file changes before starting...
