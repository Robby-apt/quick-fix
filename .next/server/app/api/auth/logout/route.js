/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/logout/route";
exports.ids = ["app/api/auth/logout/route"];
exports.modules = {

/***/ "(rsc)/./app/api/auth/logout/route.ts":
/*!**************************************!*\
  !*** ./app/api/auth/logout/route.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_auth_session__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/auth/session */ \"(rsc)/./lib/auth/session.ts\");\n\n\nasync function POST() {\n    (0,_lib_auth_session__WEBPACK_IMPORTED_MODULE_1__.deleteSession)();\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        success: true\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvbG9nb3V0L3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUEwQztBQUNRO0FBRTNDLGVBQWVFO0lBQ3BCRCxnRUFBYUE7SUFDYixPQUFPRCxxREFBWUEsQ0FBQ0csSUFBSSxDQUFDO1FBQUVDLFNBQVM7SUFBSztBQUMzQyIsInNvdXJjZXMiOlsiL2hvbWUvcm9qZWFsL0Rlc2t0b3AvcXVpY2stZml4L2FwcC9hcGkvYXV0aC9sb2dvdXQvcm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSBcIm5leHQvc2VydmVyXCJcbmltcG9ydCB7IGRlbGV0ZVNlc3Npb24gfSBmcm9tIFwiQC9saWIvYXV0aC9zZXNzaW9uXCJcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QoKSB7XG4gIGRlbGV0ZVNlc3Npb24oKVxuICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBzdWNjZXNzOiB0cnVlIH0pXG59XG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiZGVsZXRlU2Vzc2lvbiIsIlBPU1QiLCJqc29uIiwic3VjY2VzcyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/logout/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/auth/session.ts":
/*!*****************************!*\
  !*** ./lib/auth/session.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createSession: () => (/* binding */ createSession),\n/* harmony export */   decrypt: () => (/* binding */ decrypt),\n/* harmony export */   deleteSession: () => (/* binding */ deleteSession),\n/* harmony export */   encrypt: () => (/* binding */ encrypt),\n/* harmony export */   getSessionFromRequest: () => (/* binding */ getSessionFromRequest),\n/* harmony export */   verifySession: () => (/* binding */ verifySession)\n/* harmony export */ });\n/* harmony import */ var jose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jose */ \"(rsc)/./node_modules/jose/dist/webapi/jwt/sign.js\");\n/* harmony import */ var jose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jose */ \"(rsc)/./node_modules/jose/dist/webapi/jwt/verify.js\");\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n\n\nconst secretKey = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';\nconst key = new TextEncoder().encode(secretKey);\n// filepath: [session.ts](http://_vscodecontentref_/7)\nasync function encrypt(payload) {\n    // Convert expiresAt to ISO string for JWT compatibility\n    const jwtPayload = {\n        ...payload,\n        expiresAt: payload.expiresAt.toISOString()\n    };\n    return await new jose__WEBPACK_IMPORTED_MODULE_1__.SignJWT(jwtPayload).setProtectedHeader({\n        alg: 'HS256'\n    }).setIssuedAt().setExpirationTime('7d').sign(key);\n}\n// filepath: [session.ts](http://_vscodecontentref_/8)\nasync function decrypt(input) {\n    const { payload } = await (0,jose__WEBPACK_IMPORTED_MODULE_2__.jwtVerify)(input, key, {\n        algorithms: [\n            'HS256'\n        ]\n    });\n    return {\n        ...payload,\n        expiresAt: new Date(payload.expiresAt)\n    };\n}\nasync function createSession(userId, email, role) {\n    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days\n    const session = await encrypt({\n        userId,\n        email,\n        role,\n        expiresAt\n    });\n    const cookieStore = await (0,next_headers__WEBPACK_IMPORTED_MODULE_0__.cookies)();\n    cookieStore.set('session', session, {\n        expires: expiresAt,\n        httpOnly: true,\n        secure: \"development\" === 'production',\n        sameSite: 'lax',\n        path: '/'\n    });\n}\nasync function verifySession() {\n    const cookieStore = await (0,next_headers__WEBPACK_IMPORTED_MODULE_0__.cookies)();\n    const cookie = cookieStore.get('session')?.value;\n    if (!cookie) return null;\n    try {\n        const session = await decrypt(cookie);\n        return session;\n    } catch (error) {\n        return null;\n    }\n}\nasync function deleteSession() {\n    const cookieStore = await (0,next_headers__WEBPACK_IMPORTED_MODULE_0__.cookies)();\n    cookieStore.delete('session');\n}\nasync function getSessionFromRequest(request) {\n    const cookie = request.cookies.get('session')?.value;\n    if (!cookie) return null;\n    try {\n        const session = await decrypt(cookie);\n        return session;\n    } catch (error) {\n        return null;\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvYXV0aC9zZXNzaW9uLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUEwQztBQUNIO0FBR3ZDLE1BQU1HLFlBQ0xDLFFBQVFDLEdBQUcsQ0FBQ0MsVUFBVSxJQUFJO0FBQzNCLE1BQU1DLE1BQU0sSUFBSUMsY0FBY0MsTUFBTSxDQUFDTjtBQVNyQyxzREFBc0Q7QUFDL0MsZUFBZU8sUUFBUUMsT0FBdUI7SUFDcEQsd0RBQXdEO0lBQ3hELE1BQU1DLGFBQWE7UUFDbEIsR0FBR0QsT0FBTztRQUNWRSxXQUFXRixRQUFRRSxTQUFTLENBQUNDLFdBQVc7SUFDekM7SUFDQSxPQUFPLE1BQU0sSUFBSWQseUNBQU9BLENBQUNZLFlBQ3ZCRyxrQkFBa0IsQ0FBQztRQUFFQyxLQUFLO0lBQVEsR0FDbENDLFdBQVcsR0FDWEMsaUJBQWlCLENBQUMsTUFDbEJDLElBQUksQ0FBQ1o7QUFDUjtBQUVBLHNEQUFzRDtBQUMvQyxlQUFlYSxRQUFRQyxLQUFhO0lBQzFDLE1BQU0sRUFBRVYsT0FBTyxFQUFFLEdBQUcsTUFBTVYsK0NBQVNBLENBQUNvQixPQUFPZCxLQUFLO1FBQy9DZSxZQUFZO1lBQUM7U0FBUTtJQUN0QjtJQUNBLE9BQU87UUFDTixHQUFHWCxPQUFPO1FBQ1ZFLFdBQVcsSUFBSVUsS0FBS1osUUFBUUUsU0FBUztJQUN0QztBQUNEO0FBRU8sZUFBZVcsY0FDckJDLE1BQWMsRUFDZEMsS0FBYSxFQUNiQyxJQUFxQztJQUVyQyxNQUFNZCxZQUFZLElBQUlVLEtBQUtBLEtBQUtLLEdBQUcsS0FBSyxJQUFJLEtBQUssS0FBSyxLQUFLLE9BQU8sU0FBUztJQUMzRSxNQUFNQyxVQUFVLE1BQU1uQixRQUFRO1FBQUVlO1FBQVFDO1FBQU9DO1FBQU1kO0lBQVU7SUFFL0QsTUFBTWlCLGNBQWMsTUFBTTVCLHFEQUFPQTtJQUNqQzRCLFlBQVlDLEdBQUcsQ0FBQyxXQUFXRixTQUFTO1FBQ25DRyxTQUFTbkI7UUFDVG9CLFVBQVU7UUFDVkMsUUFBUTlCLGtCQUF5QjtRQUNqQytCLFVBQVU7UUFDVkMsTUFBTTtJQUNQO0FBQ0Q7QUFFTyxlQUFlQztJQUNyQixNQUFNUCxjQUFjLE1BQU01QixxREFBT0E7SUFDakMsTUFBTW9DLFNBQVNSLFlBQVlTLEdBQUcsQ0FBQyxZQUFZQztJQUMzQyxJQUFJLENBQUNGLFFBQVEsT0FBTztJQUVwQixJQUFJO1FBQ0gsTUFBTVQsVUFBVSxNQUFNVCxRQUFRa0I7UUFDOUIsT0FBT1Q7SUFDUixFQUFFLE9BQU9ZLE9BQU87UUFDZixPQUFPO0lBQ1I7QUFDRDtBQUVPLGVBQWVDO0lBQ3JCLE1BQU1aLGNBQWMsTUFBTTVCLHFEQUFPQTtJQUNqQzRCLFlBQVlhLE1BQU0sQ0FBQztBQUNwQjtBQUVPLGVBQWVDLHNCQUFzQkMsT0FBb0I7SUFDL0QsTUFBTVAsU0FBU08sUUFBUTNDLE9BQU8sQ0FBQ3FDLEdBQUcsQ0FBQyxZQUFZQztJQUMvQyxJQUFJLENBQUNGLFFBQVEsT0FBTztJQUVwQixJQUFJO1FBQ0gsTUFBTVQsVUFBVSxNQUFNVCxRQUFRa0I7UUFDOUIsT0FBT1Q7SUFDUixFQUFFLE9BQU9ZLE9BQU87UUFDZixPQUFPO0lBQ1I7QUFDRCIsInNvdXJjZXMiOlsiL2hvbWUvcm9qZWFsL0Rlc2t0b3AvcXVpY2stZml4L2xpYi9hdXRoL3Nlc3Npb24udHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2lnbkpXVCwgand0VmVyaWZ5IH0gZnJvbSAnam9zZSc7XG5pbXBvcnQgeyBjb29raWVzIH0gZnJvbSAnbmV4dC9oZWFkZXJzJztcbmltcG9ydCB0eXBlIHsgTmV4dFJlcXVlc3QgfSBmcm9tICduZXh0L3NlcnZlcic7XG5cbmNvbnN0IHNlY3JldEtleSA9XG5cdHByb2Nlc3MuZW52LkpXVF9TRUNSRVQgfHwgJ3lvdXItc2VjcmV0LWtleS1jaGFuZ2UtdGhpcy1pbi1wcm9kdWN0aW9uJztcbmNvbnN0IGtleSA9IG5ldyBUZXh0RW5jb2RlcigpLmVuY29kZShzZWNyZXRLZXkpO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNlc3Npb25QYXlsb2FkIHtcblx0dXNlcklkOiBzdHJpbmc7XG5cdGVtYWlsOiBzdHJpbmc7XG5cdHJvbGU6ICdjbGllbnQnIHwgJ2hhbmR5bWFuJyB8ICdhZG1pbic7XG5cdGV4cGlyZXNBdDogRGF0ZTtcbn1cblxuLy8gZmlsZXBhdGg6IFtzZXNzaW9uLnRzXShodHRwOi8vX3ZzY29kZWNvbnRlbnRyZWZfLzcpXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZW5jcnlwdChwYXlsb2FkOiBTZXNzaW9uUGF5bG9hZCkge1xuXHQvLyBDb252ZXJ0IGV4cGlyZXNBdCB0byBJU08gc3RyaW5nIGZvciBKV1QgY29tcGF0aWJpbGl0eVxuXHRjb25zdCBqd3RQYXlsb2FkID0ge1xuXHRcdC4uLnBheWxvYWQsXG5cdFx0ZXhwaXJlc0F0OiBwYXlsb2FkLmV4cGlyZXNBdC50b0lTT1N0cmluZygpLFxuXHR9O1xuXHRyZXR1cm4gYXdhaXQgbmV3IFNpZ25KV1Qoand0UGF5bG9hZClcblx0XHQuc2V0UHJvdGVjdGVkSGVhZGVyKHsgYWxnOiAnSFMyNTYnIH0pXG5cdFx0LnNldElzc3VlZEF0KClcblx0XHQuc2V0RXhwaXJhdGlvblRpbWUoJzdkJylcblx0XHQuc2lnbihrZXkpO1xufVxuXG4vLyBmaWxlcGF0aDogW3Nlc3Npb24udHNdKGh0dHA6Ly9fdnNjb2RlY29udGVudHJlZl8vOClcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWNyeXB0KGlucHV0OiBzdHJpbmcpOiBQcm9taXNlPFNlc3Npb25QYXlsb2FkPiB7XG5cdGNvbnN0IHsgcGF5bG9hZCB9ID0gYXdhaXQgand0VmVyaWZ5KGlucHV0LCBrZXksIHtcblx0XHRhbGdvcml0aG1zOiBbJ0hTMjU2J10sXG5cdH0pO1xuXHRyZXR1cm4ge1xuXHRcdC4uLnBheWxvYWQsXG5cdFx0ZXhwaXJlc0F0OiBuZXcgRGF0ZShwYXlsb2FkLmV4cGlyZXNBdCBhcyBzdHJpbmcpLFxuXHR9IGFzIFNlc3Npb25QYXlsb2FkO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlU2Vzc2lvbihcblx0dXNlcklkOiBzdHJpbmcsXG5cdGVtYWlsOiBzdHJpbmcsXG5cdHJvbGU6ICdjbGllbnQnIHwgJ2hhbmR5bWFuJyB8ICdhZG1pbidcbikge1xuXHRjb25zdCBleHBpcmVzQXQgPSBuZXcgRGF0ZShEYXRlLm5vdygpICsgNyAqIDI0ICogNjAgKiA2MCAqIDEwMDApOyAvLyA3IGRheXNcblx0Y29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGVuY3J5cHQoeyB1c2VySWQsIGVtYWlsLCByb2xlLCBleHBpcmVzQXQgfSk7XG5cblx0Y29uc3QgY29va2llU3RvcmUgPSBhd2FpdCBjb29raWVzKCk7XG5cdGNvb2tpZVN0b3JlLnNldCgnc2Vzc2lvbicsIHNlc3Npb24sIHtcblx0XHRleHBpcmVzOiBleHBpcmVzQXQsXG5cdFx0aHR0cE9ubHk6IHRydWUsXG5cdFx0c2VjdXJlOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nLFxuXHRcdHNhbWVTaXRlOiAnbGF4Jyxcblx0XHRwYXRoOiAnLycsXG5cdH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdmVyaWZ5U2Vzc2lvbigpIHtcblx0Y29uc3QgY29va2llU3RvcmUgPSBhd2FpdCBjb29raWVzKCk7XG5cdGNvbnN0IGNvb2tpZSA9IGNvb2tpZVN0b3JlLmdldCgnc2Vzc2lvbicpPy52YWx1ZTtcblx0aWYgKCFjb29raWUpIHJldHVybiBudWxsO1xuXG5cdHRyeSB7XG5cdFx0Y29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGRlY3J5cHQoY29va2llKTtcblx0XHRyZXR1cm4gc2Vzc2lvbjtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlU2Vzc2lvbigpIHtcblx0Y29uc3QgY29va2llU3RvcmUgPSBhd2FpdCBjb29raWVzKCk7XG5cdGNvb2tpZVN0b3JlLmRlbGV0ZSgnc2Vzc2lvbicpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0U2Vzc2lvbkZyb21SZXF1ZXN0KHJlcXVlc3Q6IE5leHRSZXF1ZXN0KSB7XG5cdGNvbnN0IGNvb2tpZSA9IHJlcXVlc3QuY29va2llcy5nZXQoJ3Nlc3Npb24nKT8udmFsdWU7XG5cdGlmICghY29va2llKSByZXR1cm4gbnVsbDtcblxuXHR0cnkge1xuXHRcdGNvbnN0IHNlc3Npb24gPSBhd2FpdCBkZWNyeXB0KGNvb2tpZSk7XG5cdFx0cmV0dXJuIHNlc3Npb247XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn1cbiJdLCJuYW1lcyI6WyJTaWduSldUIiwiand0VmVyaWZ5IiwiY29va2llcyIsInNlY3JldEtleSIsInByb2Nlc3MiLCJlbnYiLCJKV1RfU0VDUkVUIiwia2V5IiwiVGV4dEVuY29kZXIiLCJlbmNvZGUiLCJlbmNyeXB0IiwicGF5bG9hZCIsImp3dFBheWxvYWQiLCJleHBpcmVzQXQiLCJ0b0lTT1N0cmluZyIsInNldFByb3RlY3RlZEhlYWRlciIsImFsZyIsInNldElzc3VlZEF0Iiwic2V0RXhwaXJhdGlvblRpbWUiLCJzaWduIiwiZGVjcnlwdCIsImlucHV0IiwiYWxnb3JpdGhtcyIsIkRhdGUiLCJjcmVhdGVTZXNzaW9uIiwidXNlcklkIiwiZW1haWwiLCJyb2xlIiwibm93Iiwic2Vzc2lvbiIsImNvb2tpZVN0b3JlIiwic2V0IiwiZXhwaXJlcyIsImh0dHBPbmx5Iiwic2VjdXJlIiwic2FtZVNpdGUiLCJwYXRoIiwidmVyaWZ5U2Vzc2lvbiIsImNvb2tpZSIsImdldCIsInZhbHVlIiwiZXJyb3IiLCJkZWxldGVTZXNzaW9uIiwiZGVsZXRlIiwiZ2V0U2Vzc2lvbkZyb21SZXF1ZXN0IiwicmVxdWVzdCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth/session.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Flogout%2Froute&page=%2Fapi%2Fauth%2Flogout%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogout%2Froute.ts&appDir=%2Fhome%2Frojeal%2FDesktop%2Fquick-fix%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frojeal%2FDesktop%2Fquick-fix&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Flogout%2Froute&page=%2Fapi%2Fauth%2Flogout%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogout%2Froute.ts&appDir=%2Fhome%2Frojeal%2FDesktop%2Fquick-fix%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frojeal%2FDesktop%2Fquick-fix&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _home_rojeal_Desktop_quick_fix_app_api_auth_logout_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/auth/logout/route.ts */ \"(rsc)/./app/api/auth/logout/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/logout/route\",\n        pathname: \"/api/auth/logout\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/logout/route\"\n    },\n    resolvedPagePath: \"/home/rojeal/Desktop/quick-fix/app/api/auth/logout/route.ts\",\n    nextConfigOutput,\n    userland: _home_rojeal_Desktop_quick_fix_app_api_auth_logout_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGbG9nb3V0JTJGcm91dGUmcGFnZT0lMkZhcGklMkZhdXRoJTJGbG9nb3V0JTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGYXV0aCUyRmxvZ291dCUyRnJvdXRlLnRzJmFwcERpcj0lMkZob21lJTJGcm9qZWFsJTJGRGVza3RvcCUyRnF1aWNrLWZpeCUyRmFwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9JTJGaG9tZSUyRnJvamVhbCUyRkRlc2t0b3AlMkZxdWljay1maXgmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ1c7QUFDeEY7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9ob21lL3JvamVhbC9EZXNrdG9wL3F1aWNrLWZpeC9hcHAvYXBpL2F1dGgvbG9nb3V0L3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9hdXRoL2xvZ291dC9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2F1dGgvbG9nb3V0XCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9hdXRoL2xvZ291dC9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi9ob21lL3JvamVhbC9EZXNrdG9wL3F1aWNrLWZpeC9hcHAvYXBpL2F1dGgvbG9nb3V0L3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Flogout%2Froute&page=%2Fapi%2Fauth%2Flogout%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogout%2Froute.ts&appDir=%2Fhome%2Frojeal%2FDesktop%2Fquick-fix%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frojeal%2FDesktop%2Fquick-fix&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/jose"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Flogout%2Froute&page=%2Fapi%2Fauth%2Flogout%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogout%2Froute.ts&appDir=%2Fhome%2Frojeal%2FDesktop%2Fquick-fix%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frojeal%2FDesktop%2Fquick-fix&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();