/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"datosmaestros3/datosmaestros3/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});