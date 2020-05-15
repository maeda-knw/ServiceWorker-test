
self.addEventListener("install", function (event) {
	event.waitUntil( // waitUntilの引数が成功するまで、SWはインストールされない。

		// caches.openメソッドで、キャッシュを生成する。v1はキャッシュ名
		// 返り値は、promise
		caches.open(
			"v1"
		).then(function (cache) {
			// caches.openメソッドが解決されたら、addAll関数を実行する。
			// addAllは、キャッシュしたいリソースの配列が引数になる。
			return cache.addAll([
				"/ServiceWorker-test/",
				"/ServiceWorker-test/index.html",
				"/ServiceWorker-test/resources.js",
				"/ServiceWorker-test/app.js",
				"/ServiceWorker-test/res/blue.png",
				"/ServiceWorker-test/res/red.png",
				"/ServiceWorker-test/res/aiueo.m4a"
			]);
		}).catch(function (error) {
			console.log(error);
		})
	);
});

self.addEventListener('fetch', function (event) {
	event.respondWith(
		caches.match(
			event.request
		).then(function (response) {
			// caches.match() always resolves
			// but in case of success response will have value
			if (response !== undefined) {
				return response;
			} else {
				return fetch(
					event.request
				).then(function (response) {
					// response may be used only once
					// we need to save clone to put one copy in cache
					// and serve second one
					let responseClone = response.clone();
					caches.open(
						'v1'
					).then(function (cache) {
						cache.put(event.request, responseClone);
					}).catch(function(error){
						console.log(error);
					});

					return response;
				}).catch(function () {
					return caches.match('/ServiceWorker-test/res/blue.png');
				});
			}
		}).catch(function (error) {
			console.log(error);
		})
	);
});