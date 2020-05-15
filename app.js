if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register(
		"/ServiceWorker-test/sw.js", // これがSW。まずはこれを登録する。オリジンからの相対パスで指定。
		{ scope: "/ServiceWorker-test/" } // SWが制御するコンテンツのサブセット
	).then(function (reg) {
		console.log("sw then");
		console.log(reg);
	}).catch(function (error) {
		console.log("sw catch");
	});

} else {
	console.log("sw is not availabe");
}

// function for loading each image via XHR
function resLoad(resJSON) {
	// return a promise for an image loading
	return new Promise(function (resolve, reject) {
		var request = new XMLHttpRequest();
		request.open("GET", resJSON.src);
		request.responseType = "blob";

		request.onload = function () {
			if (request.status == 200) {
				var arrResponse = [];
				console.log(request.response);
				arrResponse[0] = request.response;
				arrResponse[1] = resJSON;
				resolve(arrResponse);
			} else {
				reject(Error("Image didn\"t load successfully; error code:" + request.statusText));
			}
		};

		request.onerror = function () {
			reject(Error("There was a network error."));
		};

		// Send the request
		request.send();
	});
}

window.onload = function () {
	var resSection = document.querySelector("div");

	// load each set of image
	resources.images.forEach(function (val, i) {
		resLoad(
			val
		).then(function (arrResponse) {
			var myImage = document.createElement("img");
			var myFigure = document.createElement("figure");
			var imageURL = window.URL.createObjectURL(arrResponse[0]);

			myImage.src = imageURL;
			resSection.appendChild(myFigure);
			myFigure.appendChild(myImage);

		}, function (Error) {
			console.log(Error);

		});
	});

	// load each set of sound
	resources.sounds.forEach(function (val, i) {
		resLoad(
			val
		).then(function (arrResponse) {
			var myAudio = document.createElement("audio");
			var mySource = document.createElement("source");
			var audioURL = window.URL.createObjectURL(arrResponse[0]);

			myAudio.controls = true;
			mySource.src = audioURL;
			resSection.appendChild(myAudio);
			myAudio.appendChild(mySource);

		}, function (Error) {
			console.log(Error);

		});
	});
};
