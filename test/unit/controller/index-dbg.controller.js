/*global QUnit*/

sap.ui.define([
	"datosmaestros3/datosmaestros3/controller/index.controller"
], function (oController) {
	"use strict";

	QUnit.module("index Controller");

	QUnit.test("I should test the index controller", function (assert) {
		var oAppController = new oController();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});