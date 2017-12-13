'use strict';

(function () {
  /**
   * window.synchronizeFields - Синхронизирует текущее значение основного поля со значением
   * зависимого от него поля с тем же индексом с использованием функции syncCallback,
   * описывающей эту зависимость.
   *
   * @param  {Node}     firstField   Основное поле.
   * @param  {Node}     secondField  Зависимое поле.
   * @param  {Array}    firstValues  Значения основного поля.
   * @param  {Array}    secondValues Значения зависимого поля.
   * @param  {function} syncCallback Функция, описывающая зависимость полей.
   */
  window.synchronizeFields = function (firstField, secondField, firstValues, secondValues, syncCallback) {
    var currentIndex = firstValues.indexOf(firstField.value);
    syncCallback(secondField, secondValues[currentIndex]);
  };
})();
