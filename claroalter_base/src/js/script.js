/**
 * @file
 * Theme script file.
 */

(function (Drupal, $, once) {
  'use strict'

  // ! doSomething
  Drupal.behaviors.doSomething = {
    attach (context) {
      const doingSomething = '.view-content'
      $(once('doing-something', doingSomething, context)).each(function () {
        // doSomething
      })
    }
  }
}(window.Drupal, window.jQuery, window.once))
