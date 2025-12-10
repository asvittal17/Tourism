// src/services/api.js
// compatibility shim: re-export the local LocalStorage API as `default`
// so pages that import `api` keep working.

import localApi from "./localApi";
export default localApi;
