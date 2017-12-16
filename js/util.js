'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var isEscEvent = function (evt, action) {
    if (evt.keyCode === ESC_KEYCODE) {
      action();
    }
  };

  var isEnterEvent = function (evt, action) {
    if (evt.keyCode === ENTER_KEYCODE) {
      action();
    }
  };

  /**
   * getRandomNumber - Возвращает целое случайное число из интервала [min, max].
   *
   * @param  {number} min Левая граница интервала (включая min).
   * @param  {number} max Правая граница интервала (включая max).
   * @return {number}     Случайное число из интервала [min, max].
   */
  var getRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  };

  /**
   * getRandomElement - Возвращает случайный элемент массива.
   *
   * @param  {Array}   array      Массив, из которого возвращается элемент.
   * @param  {boolean} needRemove Способ, которым возвращается элемент.
   * True - выбранный элемент удаляется из массива, false - не удаляется.
   * @return {*}                  Элемент массива.
   */
  var getRandomElement = function (array, needRemove) {
    var randomElementIndex = getRandomNumber(0, array.length - 1);
    var randomElement = array[randomElementIndex];

    if (needRemove) {
      array.splice(randomElementIndex, 1);
    }

    return randomElement;
  };

  /**
   * getArray - возвращает массив заданной длины с неповторяющимися элементами
   * на основе переданного массива.
   *
   * @param  {Array}  array  Массив, на основе которого формируется новый массив.
   * @param  {number} length Длина формируемого массива.
   * @return {Array}         Сформированный массив.
   */
  var getArray = function (array, length) {
    var result = [];
    var clone = array.slice();

    for (var i = 0; i < length; i++) {
      var randomElement = getRandomElement(clone, true);
      result.push(randomElement);
    }

    return result;
  };

  window.util = {
    isEscEvent: isEscEvent,
    isEnterEvent: isEnterEvent,
    getArray: getArray
  };
})();
