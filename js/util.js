'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  window.util = {
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },

    isEnterEvent: function (evt, action) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action();
      }
    },

    /**
     * getRandomNumber - Возвращает целое случайное число из интервала [min, max].
     *
     * @param  {number} min Левая граница интервала (включая min).
     * @param  {number} max Правая граница интервала (включая max).
     * @return {number}     Случайное число из интервала [min, max].
     */
    getRandomNumber: function (min, max) {
      return Math.floor(Math.random() * (max + 1 - min)) + min;
    },

    /**
     * getRandomElement - Возвращает случайный элемент массива.
     *
     * @param  {Array}   array      Массив, из которого возвращается элемент.
     * @param  {boolean} needRemove Способ, которым возвращается элемент.
     * True - выбранный элемент удаляется из массива, false - не удаляется.
     * @return {*}                  Элемент массива.
     */
    getRandomElement: function (array, needRemove) {
      var randomElementIndex = Math.floor(Math.random() * array.length);
      var randomElement = array[randomElementIndex];

      if (needRemove) {
        array.splice(randomElementIndex, 1);
      }

      return randomElement;
    }
  };
})();
