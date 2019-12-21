/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "43d09b1bdd1e21cfee80";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire("./src/server.js")(__webpack_require__.s = "./src/server.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/constants.js":
/*!**************************!*\
  !*** ./src/constants.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

var constants = {
  DEV_ENVIRONEMENT: 'development',
  COOKIE_NAME: 'session'
};
module.exports = constants;

/***/ }),

/***/ "./src/graphQL/appConfig/index.graphql":
/*!*********************************************!*\
  !*** ./src/graphQL/appConfig/index.graphql ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {


    var doc = {"kind":"Document","definitions":[{"kind":"ObjectTypeExtension","name":{"kind":"Name","value":"Query"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","description":{"kind":"StringValue","value":"Return true if app is configured","block":false},"name":{"kind":"Name","value":"appConfigured"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"ObjectTypeExtension","name":{"kind":"Name","value":"Mutation"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","description":{"kind":"StringValue","value":"Create root User","block":false},"name":{"kind":"Name","value":"createRootUser"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"secret"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"email"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"password"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]}],"loc":{"start":0,"end":213}};
    doc.loc.source = {"body":"extend type Query {\n    \"Return true if app is configured\"\n    appConfigured: Boolean\n}\n\nextend type Mutation {\n    \"Create root User\"\n    createRootUser(secret:String!, email:String!,password:String!): Boolean\n}\n","name":"GraphQL request","locationOffset":{"line":1,"column":1}};
  

    var names = {};
    function unique(defs) {
      return defs.filter(
        function(def) {
          if (def.kind !== 'FragmentDefinition') return true;
          var name = def.name.value
          if (names[name]) {
            return false;
          } else {
            names[name] = true;
            return true;
          }
        }
      )
    }
  

      module.exports = doc;
    


/***/ }),

/***/ "./src/graphQL/index.js":
/*!******************************!*\
  !*** ./src/graphQL/index.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/taggedTemplateLiteral */ "@babel/runtime/helpers/taggedTemplateLiteral");
/* harmony import */ var _babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _appConfig_index_graphql__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./appConfig/index.graphql */ "./src/graphQL/appConfig/index.graphql");
/* harmony import */ var _appConfig_index_graphql__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_appConfig_index_graphql__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _user_index_graphql__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./user/index.graphql */ "./src/graphQL/user/index.graphql");
/* harmony import */ var _user_index_graphql__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_user_index_graphql__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var apollo_server__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! apollo-server */ "apollo-server");
/* harmony import */ var apollo_server__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(apollo_server__WEBPACK_IMPORTED_MODULE_3__);


function _templateObject() {
  var data = _babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0___default()(["    \n    type Query {\n        root: String\n    }\n    type Mutation {\n        root: String\n    }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}




var root = Object(apollo_server__WEBPACK_IMPORTED_MODULE_3__["gql"])(_templateObject());
var schemaArray = [root, _appConfig_index_graphql__WEBPACK_IMPORTED_MODULE_1___default.a, _user_index_graphql__WEBPACK_IMPORTED_MODULE_2___default.a];
/* harmony default export */ __webpack_exports__["default"] = (schemaArray);

/***/ }),

/***/ "./src/graphQL/user/index.graphql":
/*!****************************************!*\
  !*** ./src/graphQL/user/index.graphql ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {


    var doc = {"kind":"Document","definitions":[{"kind":"ObjectTypeDefinition","description":{"kind":"StringValue","value":"User","block":false},"name":{"kind":"Name","value":"User"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","description":{"kind":"StringValue","value":"UUID","block":false},"name":{"kind":"Name","value":"_id"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","description":{"kind":"StringValue","value":"User firstname","block":false},"name":{"kind":"Name","value":"firstName"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","description":{"kind":"StringValue","value":"User lastname","block":false},"name":{"kind":"Name","value":"lastName"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","description":{"kind":"StringValue","value":"User email used as login","block":false},"name":{"kind":"Name","value":"email"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"LoginAnswer"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","description":{"kind":"StringValue","value":"True if user is authenticated false otherwise ","block":false},"name":{"kind":"Name","value":"authenticated"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","description":{"kind":"StringValue","value":"Try left before user will be blocked","block":false},"name":{"kind":"Name","value":"tryLeft"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","description":{"kind":"StringValue","value":"How many time user need to wait before next authentication try","block":false},"name":{"kind":"Name","value":"retryAfter"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}]},{"kind":"ObjectTypeExtension","name":{"kind":"Name","value":"Query"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","description":{"kind":"StringValue","value":"Return all users","block":false},"name":{"kind":"Name","value":"users"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"User"}}},"directives":[]},{"kind":"FieldDefinition","description":{"kind":"StringValue","value":"Return user connected information's","block":false},"name":{"kind":"Name","value":"me"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"directives":[]}]},{"kind":"ObjectTypeExtension","name":{"kind":"Name","value":"Mutation"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","description":{"kind":"StringValue","value":"Login","block":false},"name":{"kind":"Name","value":"login"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"email"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"password"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginAnswer"}},"directives":[]},{"kind":"FieldDefinition","description":{"kind":"StringValue","value":"Logout","block":false},"name":{"kind":"Name","value":"logout"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","description":{"kind":"StringValue","value":"Send reset Password Link","block":false},"name":{"kind":"Name","value":"sendResetPasswordLink"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"email"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]}],"loc":{"start":0,"end":751}};
    doc.loc.source = {"body":"\"User\"\ntype User {\n    \"UUID\"\n    _id:String\n    \"User firstname\"\n    firstName:String\n    \"User lastname\"\n    lastName:String\n    \"User email used as login\"\n    email:String\n}\n\ntype LoginAnswer {\n    \"True if user is authenticated false otherwise \"\n    authenticated:Boolean\n    \"Try left before user will be blocked\"\n    tryLeft:Int\n    \"How many time user need to wait before next authentication try\"\n    retryAfter:Int\n}\n\nextend type Query {\n    \"Return all users\"\n    users: [User]\n    \"Return user connected information's\"\n    me: User\n}\n\nextend type Mutation {\n    \"Login\"\n    login(email:String!,password:String!): LoginAnswer\n    \"Logout\"\n    logout : Boolean\n    \"Send reset Password Link\"\n    sendResetPasswordLink(email:String!): String\n}\n","name":"GraphQL request","locationOffset":{"line":1,"column":1}};
  

    var names = {};
    function unique(defs) {
      return defs.filter(
        function(def) {
          if (def.kind !== 'FragmentDefinition') return true;
          var name = def.name.value
          if (names[name]) {
            return false;
          } else {
            names[name] = true;
            return true;
          }
        }
      )
    }
  

      module.exports = doc;
    


/***/ }),

/***/ "./src/model/appConfig/index.js":
/*!**************************************!*\
  !*** ./src/model/appConfig/index.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);

var userSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema({
  enabled: Boolean,
  secret: String
}, {
  collection: 'appConfig'
});
var AppConfig = mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('appConfig', userSchema);
/* harmony default export */ __webpack_exports__["default"] = (AppConfig);

/***/ }),

/***/ "./src/model/users/index.js":
/*!**********************************!*\
  !*** ./src/model/users/index.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);

var userSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  isAdmin: {
    type: Boolean,
    "default": false
  }
}, {
  collection: 'users'
});
var Users = mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('users', userSchema);
/* harmony default export */ __webpack_exports__["default"] = (Users);

/***/ }),

/***/ "./src/resolver/appConfig/index.js":
/*!*****************************************!*\
  !*** ./src/resolver/appConfig/index.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var apollo_server__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! apollo-server */ "apollo-server");
/* harmony import */ var apollo_server__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(apollo_server__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var ROOT_services_AppConfigureService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ROOT/services/AppConfigureService */ "./src/services/AppConfigureService/index.js");



var resolvers = {
  Query: {
    appConfigured: function appConfigured() {
      return ROOT_services_AppConfigureService__WEBPACK_IMPORTED_MODULE_2__["default"].appConfigured();
    }
  },
  Mutation: {
    createRootUser: function createRootUser(parent, args) {
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function createRootUser$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              return _context.abrupt("return", ROOT_services_AppConfigureService__WEBPACK_IMPORTED_MODULE_2__["default"].createRootUser(args.secret, args.email, args.password));

            case 4:
              _context.prev = 4;
              _context.t0 = _context["catch"](0);
              throw new apollo_server__WEBPACK_IMPORTED_MODULE_1__["AuthenticationError"]('authentication failed');

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[0, 4]]);
    }
  }
};
/* harmony default export */ __webpack_exports__["default"] = (resolvers);

/***/ }),

/***/ "./src/resolver/index.js":
/*!*******************************!*\
  !*** ./src/resolver/index.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _users__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./users */ "./src/resolver/users/index.js");
/* harmony import */ var _appConfig__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./appConfig */ "./src/resolver/appConfig/index.js");




var index = lodash__WEBPACK_IMPORTED_MODULE_0___default.a.merge({
  Query: {}
}, _users__WEBPACK_IMPORTED_MODULE_1__["default"], _appConfig__WEBPACK_IMPORTED_MODULE_2__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (index);

/***/ }),

/***/ "./src/resolver/users/index.js":
/*!*************************************!*\
  !*** ./src/resolver/users/index.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ROOT_model_users__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ROOT/model/users */ "./src/model/users/index.js");
/* harmony import */ var ROOT_services_UserService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ROOT/services/UserService */ "./src/services/UserService/index.js");
/* harmony import */ var ROOT_services_logger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ROOT/services/logger */ "./src/services/logger.js");




var resolvers = {
  Query: {
    me: function me(parent, args, context) {
      if (context.user) {
        return context.user;
      }

      return new Error('Authentication failed');
    },
    users: function users(parent, args, context) {
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function users$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (context.user) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return", null);

            case 2:
              _context.next = 4;
              return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(ROOT_model_users__WEBPACK_IMPORTED_MODULE_1__["default"].find().lean());

            case 4:
              return _context.abrupt("return", _context.sent);

            case 5:
            case "end":
              return _context.stop();
          }
        }
      });
    }
  },
  Mutation: {
    login: function login(parent, args, context) {
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function login$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(ROOT_services_UserService__WEBPACK_IMPORTED_MODULE_2__["default"].login(args.email, args.password, context));

            case 3:
              return _context2.abrupt("return", _context2.sent);

            case 6:
              _context2.prev = 6;
              _context2.t0 = _context2["catch"](0);
              ROOT_services_logger__WEBPACK_IMPORTED_MODULE_3__["default"].error(_context2.t0.stack);

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[0, 6]]);
    },
    logout: function logout(parent, args, context) {
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function logout$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(ROOT_services_UserService__WEBPACK_IMPORTED_MODULE_2__["default"].logout(context));

            case 3:
              return _context3.abrupt("return", _context3.sent);

            case 6:
              _context3.prev = 6;
              _context3.t0 = _context3["catch"](0);
              ROOT_services_logger__WEBPACK_IMPORTED_MODULE_3__["default"].error(_context3.t0.stack);

            case 9:
              return _context3.abrupt("return", false);

            case 10:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, [[0, 6]]);
    },
    sendResetPasswordLink: function sendResetPasswordLink(parent, args) {
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function sendResetPasswordLink$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(ROOT_services_UserService__WEBPACK_IMPORTED_MODULE_2__["default"].sendResetPasswordLink(args.email));

            case 2:
              return _context4.abrupt("return", _context4.sent);

            case 3:
            case "end":
              return _context4.stop();
          }
        }
      });
    }
  }
};
/* harmony default export */ __webpack_exports__["default"] = (resolvers);

/***/ }),

/***/ "./src/server.js":
/*!***********************!*\
  !*** ./src/server.js ***!
  \***********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! http */ "http");
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");
/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(apollo_server_express__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var compression__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! compression */ "compression");
/* harmony import */ var compression__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(compression__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var cookie_parser__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! cookie-parser */ "cookie-parser");
/* harmony import */ var cookie_parser__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(cookie_parser__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var passport__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! passport */ "passport");
/* harmony import */ var passport__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(passport__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var passport_jwt__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! passport-jwt */ "passport-jwt");
/* harmony import */ var passport_jwt__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(passport_jwt__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var ROOT_services_AppConfigureService__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ROOT/services/AppConfigureService */ "./src/services/AppConfigureService/index.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./constants */ "./src/constants.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_constants__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _resolver__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./resolver */ "./src/resolver/index.js");
/* harmony import */ var _graphQL__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./graphQL */ "./src/graphQL/index.js");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var ROOT_model_users__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ROOT/model/users */ "./src/model/users/index.js");














var _process$env = Object({"NODE_ENV":"development","npm_config_save_dev":"","npm_config_legacy_bundling":"","npm_config_dry_run":"","npm_config_viewer":"man","npm_config_only":"","npm_config_commit_hooks":"true","npm_config_browser":"","npm_config_also":"","npm_package_dependencies_mongoose":"^5.8.1","npm_config_sign_git_commit":"","npm_config_rollback":"true","npm_package_babel_presets_0":"@babel/preset-env","rvm_bin_path":"/Users/cyrilsiman/.rvm/bin","NODE":"/Users/cyrilsiman/.nvm/versions/node/v12.13.1/bin/node","npm_config_usage":"","npm_config_audit":"true","INIT_CWD":"/Users/cyrilsiman/workPerso/workspaceNode/template-back","npm_package_devDependencies_terser_webpack_plugin":"^2.3.0","GEM_HOME":"/Users/cyrilsiman/.rvm/gems/ruby-2.5.1","NVM_CD_FLAGS":"-q","npm_config_globalignorefile":"/Users/cyrilsiman/.nvm/versions/node/v12.13.1/etc/npmignore","TERM":"xterm-256color","SHELL":"/bin/zsh","npm_config_shell":"/bin/zsh","npm_config_maxsockets":"50","npm_config_init_author_url":"","npm_config_shrinkwrap":"true","npm_config_parseable":"","npm_config_metrics_registry":"https://registry.npmjs.org/","IRBRC":"/Users/cyrilsiman/.rvm/rubies/ruby-2.5.1/.irbrc","TMPDIR":"/var/folders/8k/bsrdg3rd0ms4h5nc7jr977980000gn/T/","npm_config_timing":"","npm_config_init_license":"ISC","Apple_PubSub_Socket_Render":"/private/tmp/com.apple.launchd.EAPaqeE7Pw/Render","npm_config_if_present":"","npm_package_devDependencies_fs_extra":"^8.1.0","npm_config_sign_git_tag":"","npm_config_init_author_email":"","npm_config_cache_max":"Infinity","npm_package_devDependencies_pnp_webpack_plugin":"^1.5.0","npm_package_devDependencies_nodemon_webpack_plugin":"^4.2.1","ZDOTDIR":"","npm_config_preid":"","npm_config_long":"","npm_config_local_address":"","npm_config_git_tag_version":"true","npm_config_cert":"","MY_RUBY_HOME":"/Users/cyrilsiman/.rvm/rubies/ruby-2.5.1","npm_config_registry":"https://registry.npmjs.org/","npm_config_noproxy":"","npm_config_fetch_retries":"2","npm_package_devDependencies_clean_webpack_plugin":"^3.0.0","npm_package_dependencies_passport_local":"^1.0.0","ZSH":"/Users/cyrilsiman/.oh-my-zsh","npm_config_versions":"","npm_config_message":"%s","npm_config_key":"","__INTELLIJ_COMMAND_HISTFILE__":"/Users/cyrilsiman/Library/Preferences/WebStorm2019.3/terminal/history/history-586","npm_package_devDependencies_webpack":"^4.41.2","npm_package_devDependencies__babel_plugin_transform_runtime":"^7.7.6","npm_package_description":"Backend template ","NVM_DIR":"/Users/cyrilsiman/.nvm","USER":"cyrilsiman","npm_package_devDependencies_webpack_cli":"^3.3.10","npm_package_devDependencies_dotenv":"^8.2.0","npm_package_license":"MIT","LS_COLORS":"di=34;40:ln=35;40:so=32;40:pi=33;40:ex=31;40:bd=34;46:cd=34;43:su=1;;41:sg=1;;46:tw=0;42:ow=0;43:","npm_package_devDependencies_eslint_loader":"^3.0.3","_system_type":"Darwin","npm_config_globalconfig":"/Users/cyrilsiman/.nvm/versions/node/v12.13.1/etc/npmrc","npm_config_prefer_online":"","npm_config_logs_max":"10","npm_config_always_auth":"","npm_package_devDependencies__babel_core":"^7.7.5","npm_package_dependencies_compression":"^1.7.4","rvm_path":"/Users/cyrilsiman/.rvm","npm_package_devDependencies_babel_loader":"^8.0.6","npm_package_dependencies_lodash":"^4.17.15","SSH_AUTH_SOCK":"/private/tmp/com.apple.launchd.pJtN4SbY26/Listeners","npm_package_devDependencies_eslint":"^6.7.2","__CF_USER_TEXT_ENCODING":"0x1F5:0x0:0x1","npm_execpath":"/Users/cyrilsiman/.nvm/versions/node/v12.13.1/lib/node_modules/npm/bin/npm-cli.js","npm_config_global_style":"","npm_config_cache_lock_retries":"10","npm_package_dependencies_graphql":"^14.5.8","LOGIN_SHELL":"1","npm_config_update_notifier":"true","npm_config_cafile":"","PAGER":"less","npm_package_author_name":"Cyril Siman","npm_config_heading":"npm","npm_config_audit_level":"low","LSCOLORS":"exfxcxdxbxegedAbAgacad","npm_config_searchlimit":"20","npm_config_read_only":"","npm_config_offline":"","npm_config_fetch_retry_mintimeout":"10000","rvm_prefix":"/Users/cyrilsiman","npm_config_json":"","npm_config_access":"","npm_config_argv":"{\"remain\":[],\"cooked\":[\"run\",\"start\"],\"original\":[\"run\",\"start\"]}","npm_package_dependencies__babel_runtime":"^7.7.6","PATH":"/Users/cyrilsiman/.nvm/versions/node/v12.13.1/lib/node_modules/npm/node_modules/npm-lifecycle/node-gyp-bin:/Users/cyrilsiman/workPerso/workspaceNode/template-back/node_modules/.bin:/Users/cyrilsiman/.rvm/gems/ruby-2.5.1/bin:/Users/cyrilsiman/.rvm/gems/ruby-2.5.1@global/bin:/Users/cyrilsiman/.rvm/rubies/ruby-2.5.1/bin:/usr/local/opt:/usr/local/sbin:/Users/cyrilsiman/.nvm/versions/node/v12.13.1/bin:/Users/cyrilsiman/.cargo/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/MacGPG2/bin:/Library/Frameworks/Mono.framework/Versions/Current/Commands:/Users/cyrilsiman/workPerso/workspaceNode/template-back/node_modules/.bin:/Users/cyrilsiman/.oh-my-zsh/custom/plugins/warhol/bin:/Users/cyrilsiman/.rvm/bin","npm_config_allow_same_version":"","TERMINAL_EMULATOR":"JetBrains-JediTerm","npm_config_https_proxy":"","npm_config_engine_strict":"","npm_config_description":"true","npm_package_babel_plugins_0":"@babel/plugin-transform-runtime","_":"/Users/cyrilsiman/.nvm/versions/node/v12.13.1/bin/node","npm_config_userconfig":"/Users/cyrilsiman/.npmrc","npm_config_init_module":"/Users/cyrilsiman/.npm-init.js","npm_config_cidr":"","npm_package_devDependencies_webpack_node_externals":"^1.7.2","npm_package_devDependencies_dotenv_expand":"^5.1.0","PWD":"/Users/cyrilsiman/workPerso/workspaceNode/template-back","npm_config_user":"501","npm_config_node_version":"12.13.1","npm_package_dependencies_apollo_server":"^2.9.13","npm_lifecycle_event":"start","npm_package_devDependencies_react_dev_utils":"^10.0.0","npm_config_save":"true","npm_config_ignore_prepublish":"","npm_config_editor":"vi","npm_config_auth_type":"legacy","npm_package_name":"template-back","npm_config_tag":"latest","npm_config_script_shell":"","npm_package_devDependencies__babel_preset_env":"^7.7.6","npm_config_progress":"true","npm_config_global":"","npm_config_before":"","npm_package_scripts_build":"node scripts/build.js","npm_package_scripts_start":"node scripts/start.js","npm_config_searchstaleness":"900","npm_config_optional":"true","npm_config_ham_it_up":"","npm_package_dependencies_apollo_server_express":"^2.9.13","_system_arch":"x86_64","XPC_FLAGS":"0x0","npm_config_save_prod":"","npm_config_force":"","npm_config_bin_links":"true","npm_config_searchopts":"","_system_version":"10.14","npm_config_node_gyp":"/Users/cyrilsiman/.nvm/versions/node/v12.13.1/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js","npm_config_depth":"Infinity","npm_package_main":"index.js","npm_config_sso_poll_frequency":"500","npm_config_rebuild_bundle":"true","npm_package_dependencies_winston":"^3.2.1","npm_package_version":"1.0.0","XPC_SERVICE_NAME":"0","npm_config_unicode":"true","npm_package_dependencies_rate_limiter_flexible":"^1.2.0","rvm_version":"1.29.4 (latest)","npm_package_dependencies_passport_jwt":"^4.0.0","SHLVL":"2","HOME":"/Users/cyrilsiman","npm_config_fetch_retry_maxtimeout":"60000","npm_config_tag_version_prefix":"v","npm_config_strict_ssl":"true","npm_config_sso_type":"oauth","npm_config_scripts_prepend_node_path":"warn-only","npm_config_save_prefix":"^","npm_config_loglevel":"notice","npm_config_ca":"","npm_package_dependencies_cookie_parser":"^1.4.4","npm_config_save_exact":"","npm_config_group":"20","npm_config_fetch_retry_factor":"10","npm_config_dev":"","npm_config_version":"","npm_config_prefer_offline":"","npm_config_cache_lock_stale":"60000","npm_config_otp":"","npm_config_cache_min":"10","npm_config_searchexclude":"","npm_config_cache":"/Users/cyrilsiman/.npm","LESS":"-R","LOGNAME":"cyrilsiman","npm_lifecycle_script":"node scripts/start.js","npm_config_color":"true","npm_config_proxy":"","npm_config_package_lock":"true","GEM_PATH":"/Users/cyrilsiman/.rvm/gems/ruby-2.5.1:/Users/cyrilsiman/.rvm/gems/ruby-2.5.1@global","LC_CTYPE":"fr_FR.UTF-8","npm_config_package_lock_only":"","npm_package_devDependencies_case_sensitive_paths_webpack_plugin":"^2.2.0","npm_config_save_optional":"","NVM_BIN":"/Users/cyrilsiman/.nvm/versions/node/v12.13.1/bin","npm_config_ignore_scripts":"","npm_config_user_agent":"npm/6.12.1 node/v12.13.1 darwin x64","npm_package_devDependencies_resolve":"^1.13.1","npm_config_cache_lock_wait":"10000","npm_package_devDependencies_chalk":"^3.0.0","npm_config_production":"","npm_package_dependencies_jsonwebtoken":"^8.5.1","npm_config_send_metrics":"","npm_config_save_bundle":"","npm_package_dependencies_express":"^4.17.1","npm_config_umask":"0022","npm_config_node_options":"","npm_config_init_version":"1.0.0","npm_config_init_author_name":"","npm_config_git":"git","npm_config_scope":"","RUBY_VERSION":"ruby-2.5.1","npm_config_unsafe_perm":"true","npm_config_tmp":"/var/folders/8k/bsrdg3rd0ms4h5nc7jr977980000gn/T","npm_config_onload_script":"","npm_package_devDependencies_nodemon":"^2.0.2","_system_name":"OSX","npm_node_execpath":"/Users/cyrilsiman/.nvm/versions/node/v12.13.1/bin/node","npm_config_prefix":"/Users/cyrilsiman/.nvm/versions/node/v12.13.1","npm_config_link":"","npm_config_format_package_lock":"true","npm_package_dependencies_passport":"^0.4.1","npm_package_dependencies_bcrypt":"^3.0.7","BABEL_ENV":"development","JWT_SECRET":"TbvyUhbKEKcX9PfJSUP1","MONGOOSE_DB":"myApp","CORS":"http://localhost:3000","DISABLE_CORS":"false","PORT":"5053","BCRYPT_SALT_ROUNDS":"10","MAX_CONSECUTIVE_FAILES_BY_EMAIL":"5","BLOCK_DURATION":"900 #60 * 15, Block for 15 minutes","BLOCK_DURATION_ANALYSIS":"10800 #60 * 60 * 3, Store number for three hours since first fail","MONGOOSE_HOST":"localhost:27017","NODE_PATH":""}),
    DISABLE_CORS = _process$env.DISABLE_CORS,
    MONGOOSE_HOST = _process$env.MONGOOSE_HOST,
    MONGOOSE_DB = _process$env.MONGOOSE_DB,
    NODE_ENV = _process$env.NODE_ENV,
    PORT = _process$env.PORT,
    JWT_SECRET = _process$env.JWT_SECRET;
var whitelist = "http://localhost:3000".split(',');
var corsOptions = {
  origin: function origin(_origin, callback) {
    if (DISABLE_CORS) {
      callback(null, true);
    } else {
      if (whitelist.indexOf(_origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('This Origin ' + _origin + ' Not allowed by CORS'));
      }
    }
  },
  optionsSuccessStatus: 200,
  // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true,
  'methods': 'GET,POST'
};

var cookieExtractor = function cookieExtractor(req) {
  var token = null;

  if (req && req.signedCookies) {
    token = req.signedCookies[_constants__WEBPACK_IMPORTED_MODULE_9__["COOKIE_NAME"]];
  }

  return token;
};

var params = {
  secretOrKey: JWT_SECRET,
  jwtFromRequest: cookieExtractor
}; //export const pubsub = new PubSub()

var runServer = function runServer() {
  var jwtStrategy, app, apolloServer, httpServer;
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function runServer$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(mongoose__WEBPACK_IMPORTED_MODULE_12___default.a.connect("mongodb://".concat(MONGOOSE_HOST, "/").concat(MONGOOSE_DB), {
            useNewUrlParser: true,
            useUnifiedTopology: true
          }));

        case 2:
          console.log("\u2705 Mongo connected : ".concat(MONGOOSE_HOST, " db : ").concat(MONGOOSE_DB));
          jwtStrategy = new passport_jwt__WEBPACK_IMPORTED_MODULE_7__["Strategy"](params, function _callee(payload, done) {
            var user;
            return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(ROOT_model_users__WEBPACK_IMPORTED_MODULE_13__["default"].findOne({
                      _id: payload._id
                    }, {
                      password: 0
                    }));

                  case 2:
                    _context.t0 = _context.sent;

                    if (_context.t0) {
                      _context.next = 5;
                      break;
                    }

                    _context.t0 = null;

                  case 5:
                    user = _context.t0;
                    return _context.abrupt("return", done(null, user));

                  case 7:
                  case "end":
                    return _context.stop();
                }
              }
            });
          });
          passport__WEBPACK_IMPORTED_MODULE_6___default.a.use(jwtStrategy);
          app = express__WEBPACK_IMPORTED_MODULE_1___default()();
          app.use(cookie_parser__WEBPACK_IMPORTED_MODULE_5___default()(JWT_SECRET));
          app.use(compression__WEBPACK_IMPORTED_MODULE_4___default()());
          app.disable('x-powered-by');
          app.use('/graphql', function (req, res, next) {
            passport__WEBPACK_IMPORTED_MODULE_6___default.a.authenticate('jwt', {
              session: false
            }, function (err, user) {
              if (user) {
                req.user = user;
              }

              next();
            })(req, res, next);
          });
          apolloServer = new apollo_server_express__WEBPACK_IMPORTED_MODULE_3__["ApolloServer"]({
            typeDefs: _graphQL__WEBPACK_IMPORTED_MODULE_11__["default"],
            resolvers: _resolver__WEBPACK_IMPORTED_MODULE_10__["default"],
            debug: false,
            context: function context(_ref) {
              var req = _ref.req,
                  res = _ref.res;
              return {
                res: res,
                user: req.user
              };
            },
            introspection: _constants__WEBPACK_IMPORTED_MODULE_9__["DEV_ENVIRONEMENT"] === NODE_ENV,
            playground: _constants__WEBPACK_IMPORTED_MODULE_9__["DEV_ENVIRONEMENT"] === NODE_ENV
          });
          apolloServer.applyMiddleware({
            app: app,
            path: '/graphql',
            cors: corsOptions
          });
          httpServer = http__WEBPACK_IMPORTED_MODULE_2___default.a.createServer(app);
          apolloServer.installSubscriptionHandlers(httpServer);
          httpServer.listen("5053", function () {
            console.log("\uD83D\uDE80 Server ready at http://localhost:".concat(PORT).concat(apolloServer.graphqlPath)); //console.log(`🚀 Subscriptions ready at ws://localhost:${process.env.PORT}${apolloServer.subscriptionsPath}`)
            //At startup we check if backend is correctly configured

            Object(ROOT_services_AppConfigureService__WEBPACK_IMPORTED_MODULE_8__["checkIfAppIsConfigured"])();
          });

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  });
};

try {
  runServer();
} catch (err) {
  console.error(err);
}

/***/ }),

/***/ "./src/services/AppConfigureService/index.js":
/*!***************************************************!*\
  !*** ./src/services/AppConfigureService/index.js ***!
  \***************************************************/
/*! exports provided: checkIfAppIsConfigured, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkIfAppIsConfigured", function() { return checkIfAppIsConfigured; });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ROOT_model_appConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ROOT/model/appConfig */ "./src/model/appConfig/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./src/services/utils.js");
/* harmony import */ var ROOT_model_users__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ROOT/model/users */ "./src/model/users/index.js");
/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! bcrypt */ "bcrypt");
/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(bcrypt__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var ROOT_services_logger__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ROOT/services/logger */ "./src/services/logger.js");







var appConfigured = function appConfigured() {
  var config;
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function appConfigured$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(ROOT_model_appConfig__WEBPACK_IMPORTED_MODULE_1__["default"].find());

        case 2:
          config = _context.sent;

          if (!config) {
            _context.next = 6;
            break;
          }

          config = config[0];
          return _context.abrupt("return", config.enabled);

        case 6:
          return _context.abrupt("return", false);

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
};

var createRootUser = function createRootUser(secret, email, password) {
  var config, user;
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function createRootUser$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(ROOT_model_appConfig__WEBPACK_IMPORTED_MODULE_1__["default"].findOne({
            secret: secret
          }));

        case 3:
          config = _context2.sent;

          if (!config) {
            _context2.next = 18;
            break;
          }

          _context2.t0 = ROOT_model_users__WEBPACK_IMPORTED_MODULE_3__["default"];
          _context2.t1 = email;
          _context2.next = 9;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(bcrypt__WEBPACK_IMPORTED_MODULE_4___default.a.hash(password, parseInt("10")));

        case 9:
          _context2.t2 = _context2.sent;
          _context2.t3 = {
            isAdmin: true,
            lastName: 'Root',
            firstName: 'Root',
            email: _context2.t1,
            password: _context2.t2
          };
          user = new _context2.t0(_context2.t3);
          _context2.next = 14;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(user.save());

        case 14:
          config.enabled = true;
          _context2.next = 17;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(config.save());

        case 17:
          return _context2.abrupt("return", true);

        case 18:
          _context2.next = 23;
          break;

        case 20:
          _context2.prev = 20;
          _context2.t4 = _context2["catch"](0);
          ROOT_services_logger__WEBPACK_IMPORTED_MODULE_5__["default"].error(_context2.t4.stack);

        case 23:
          return _context2.abrupt("return", false);

        case 24:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 20]]);
};

var checkIfAppIsConfigured = function checkIfAppIsConfigured() {
  var config, secret, appConfig;
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function checkIfAppIsConfigured$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(ROOT_model_appConfig__WEBPACK_IMPORTED_MODULE_1__["default"].find());

        case 2:
          config = _context3.sent;

          if (config) {
            config = config[0];
          }

          if (!(!config || !config.enabled)) {
            _context3.next = 12;
            break;
          }

          secret = Object(_utils__WEBPACK_IMPORTED_MODULE_2__["generateRandomString"])();
          appConfig = config || new ROOT_model_appConfig__WEBPACK_IMPORTED_MODULE_1__["default"]();
          appConfig.secret = secret;
          _context3.next = 10;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(appConfig.save());

        case 10:
          console.log('Your backend isn\'t configure yet, use this temporary secret to enable it, and create admin user');
          console.log("your secret ->: ".concat(secret));

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  });
};
/* harmony default export */ __webpack_exports__["default"] = ({
  appConfigured: appConfigured,
  createRootUser: createRootUser
});

/***/ }),

/***/ "./src/services/UserService/index.js":
/*!*******************************************!*\
  !*** ./src/services/UserService/index.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ROOT_model_users__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ROOT/model/users */ "./src/model/users/index.js");
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var ROOT_constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ROOT/constants */ "./src/constants.js");
/* harmony import */ var ROOT_constants__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(ROOT_constants__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils */ "./src/services/utils.js");
/* harmony import */ var ROOT_services_logger__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ROOT/services/logger */ "./src/services/logger.js");
/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! bcrypt */ "bcrypt");
/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(bcrypt__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var rate_limiter_flexible__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rate-limiter-flexible */ "rate-limiter-flexible");
/* harmony import */ var rate_limiter_flexible__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(rate_limiter_flexible__WEBPACK_IMPORTED_MODULE_7__);








var maxConsecutiveFailsByUsername = "5";
var limiterConsecutiveFailsByUsername = new rate_limiter_flexible__WEBPACK_IMPORTED_MODULE_7__["RateLimiterMemory"]({
  points: maxConsecutiveFailsByUsername,
  duration: parseInt("10800 #60 * 60 * 3, Store number for three hours since first fail"),
  blockDuration: parseInt("900 #60 * 15, Block for 15 minutes")
});

var logout = function logout(context) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function logout$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          context.res.cookie(ROOT_constants__WEBPACK_IMPORTED_MODULE_3___default.a.COOKIE_NAME, '', {
            domain: 'api.myapp.lc',
            httpOnly: true,
            sameSite: true,
            signed: true,
            secure: true,
            maxAge: new Date(0)
          });
          return _context.abrupt("return", true);

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
};

var login = function login(email, password, context) {
  var user, rlResUsername, result, token;
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function login$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(ROOT_model_users__WEBPACK_IMPORTED_MODULE_1__["default"].findOne({
            email: email
          }));

        case 2:
          user = _context2.sent;
          _context2.next = 5;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(limiterConsecutiveFailsByUsername.get(email));

        case 5:
          rlResUsername = _context2.sent;
          result = {
            authenticated: false,
            tryLeft: 0,
            retryAfter: 0
          };

          if (!(rlResUsername !== null && rlResUsername.consumedPoints > maxConsecutiveFailsByUsername)) {
            _context2.next = 11;
            break;
          }

          result.retryAfter = Math.round(rlResUsername.msBeforeNext / 1000) || 1;
          _context2.next = 38;
          break;

        case 11:
          _context2.t0 = user;

          if (!_context2.t0) {
            _context2.next = 16;
            break;
          }

          _context2.next = 15;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(bcrypt__WEBPACK_IMPORTED_MODULE_6___default.a.compare(password, user.password));

        case 15:
          _context2.t0 = _context2.sent;

        case 16:
          if (!_context2.t0) {
            _context2.next = 24;
            break;
          }

          token = jsonwebtoken__WEBPACK_IMPORTED_MODULE_2___default.a.sign({
            _id: user._id
          }, "TbvyUhbKEKcX9PfJSUP1");
          context.res.cookie(ROOT_constants__WEBPACK_IMPORTED_MODULE_3___default.a.COOKIE_NAME, token, {
            domain: 'api.myapp.lc',
            httpOnly: true,
            sameSite: true,
            signed: true,
            secure: true
          });
          _context2.next = 21;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(limiterConsecutiveFailsByUsername["delete"](email));

        case 21:
          result.authenticated = true;
          _context2.next = 38;
          break;

        case 24:
          _context2.prev = 24;
          _context2.next = 27;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(limiterConsecutiveFailsByUsername.consume(email));

        case 27:
          rlResUsername = _context2.sent;
          result.tryLeft = maxConsecutiveFailsByUsername - rlResUsername.consumedPoints;
          _context2.next = 38;
          break;

        case 31:
          _context2.prev = 31;
          _context2.t1 = _context2["catch"](24);

          if (!(_context2.t1 instanceof Error)) {
            _context2.next = 37;
            break;
          }

          throw _context2.t1;

        case 37:
          result.retryAfter = Math.round(_context2.t1.msBeforeNext / 1000) || 1;

        case 38:
          return _context2.abrupt("return", result);

        case 39:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[24, 31]]);
};

var sendResetPasswordLink = function sendResetPasswordLink(email) {
  var user;
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function sendResetPasswordLink$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(ROOT_model_users__WEBPACK_IMPORTED_MODULE_1__["default"].findOne({
            email: email
          }));

        case 3:
          user = _context3.sent;

          if (!user) {
            _context3.next = 8;
            break;
          }

          user.resetPasswordToken = Object(_utils__WEBPACK_IMPORTED_MODULE_4__["generateRandomString"])();
          _context3.next = 8;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(user.save());

        case 8:
          _context3.next = 13;
          break;

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);
          ROOT_services_logger__WEBPACK_IMPORTED_MODULE_5__["default"].error(_context3.t0.stack);

        case 13:
          return _context3.abrupt("return", false);

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

/* harmony default export */ __webpack_exports__["default"] = ({
  login: login,
  logout: logout,
  sendResetPasswordLink: sendResetPasswordLink
});

/***/ }),

/***/ "./src/services/logger.js":
/*!********************************!*\
  !*** ./src/services/logger.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var winston__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! winston */ "winston");
/* harmony import */ var winston__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(winston__WEBPACK_IMPORTED_MODULE_0__);

var logger = winston__WEBPACK_IMPORTED_MODULE_0___default.a.createLogger({
  level: 'info',
  format: winston__WEBPACK_IMPORTED_MODULE_0___default.a.format.json(),
  defaultMeta: {
    service: 'user-service'
  },
  transports: [new winston__WEBPACK_IMPORTED_MODULE_0___default.a.transports.File({
    filename: 'error.log',
    level: 'error'
  }), new winston__WEBPACK_IMPORTED_MODULE_0___default.a.transports.File({
    filename: 'combined.log'
  })]
});

if (true) {
  logger.add(new winston__WEBPACK_IMPORTED_MODULE_0___default.a.transports.Console({
    format: winston__WEBPACK_IMPORTED_MODULE_0___default.a.format.simple()
  }));
}

/* harmony default export */ __webpack_exports__["default"] = (logger);

/***/ }),

/***/ "./src/services/utils.js":
/*!*******************************!*\
  !*** ./src/services/utils.js ***!
  \*******************************/
/*! exports provided: generateRandomString */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateRandomString", function() { return generateRandomString; });
var generateRandomString = function generateRandomString() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

/***/ }),

/***/ "@babel/runtime/helpers/taggedTemplateLiteral":
/*!***************************************************************!*\
  !*** external "@babel/runtime/helpers/taggedTemplateLiteral" ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime/helpers/taggedTemplateLiteral");

/***/ }),

/***/ "@babel/runtime/regenerator":
/*!*********************************************!*\
  !*** external "@babel/runtime/regenerator" ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime/regenerator");

/***/ }),

/***/ "apollo-server":
/*!********************************!*\
  !*** external "apollo-server" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-server");

/***/ }),

/***/ "apollo-server-express":
/*!****************************************!*\
  !*** external "apollo-server-express" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-server-express");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("bcrypt");

/***/ }),

/***/ "compression":
/*!******************************!*\
  !*** external "compression" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("compression");

/***/ }),

/***/ "cookie-parser":
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),

/***/ "passport":
/*!***************************!*\
  !*** external "passport" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("passport");

/***/ }),

/***/ "passport-jwt":
/*!*******************************!*\
  !*** external "passport-jwt" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("passport-jwt");

/***/ }),

/***/ "rate-limiter-flexible":
/*!****************************************!*\
  !*** external "rate-limiter-flexible" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("rate-limiter-flexible");

/***/ }),

/***/ "winston":
/*!**************************!*\
  !*** external "winston" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("winston");

/***/ })

/******/ });