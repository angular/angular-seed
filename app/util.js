'use strict';

/**
 * Simple class for maintaining listeners to changes to the
 * TicTacToeBoard.
 */
function SimpleEventUtil() {
    this.listeners = [];
}

SimpleEventUtil.prototype.add = function (callback, cbdata) {
    this.listeners.push(new Callback(callback, cbdata));
};

SimpleEventUtil.prototype.remove = function (callback) {
    this.listeners.destroy(this.findCallback(callback));
};

SimpleEventUtil.prototype.empty = function () {
    this.listeners = [];
};

SimpleEventUtil.prototype.fire = function (event) {
    for (var i = 0; i < this.listeners.length; i++) {
        this.listeners[i].callback(event, this.listeners[i].cbdata);
    }
};

SimpleEventUtil.prototype.findCallback = function (callback) {
    for (var i = 0; i < this.listeners.length; i++) {
        if (this.listeners[i].callback === callback)
            return this.listeners[i];
    }
    return null;
};


function Callback(callback, cbdata) {
    this.callback = callback;
    this.cbdata = cbdata;
}

/**
 * Extend Array class so that we can remove items more easily.
 *
 * From https://gist.github.com/zykadelic/5069236
 */
Array.prototype.destroy = function (obj) {
    // Return null if no objects were found and removed
    var destroyed = null;

    for (var i = 0; i < this.length; i++) {

        // Use while-loop to find adjacent equal objects
        while (this[i] === obj) {

            // Remove this[i] and store it within destroyed
            destroyed = this.splice(i, 1)[0];
        }
    }

    return destroyed;
};
