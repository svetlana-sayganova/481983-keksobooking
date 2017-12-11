'use strict';

(function () {
  var TITLES = [
    'Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец',
    'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

  var TYPES = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  var TIMES = ['12:00', '13:00', '14:00'];

  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  var COORD_X = {
    MIN: 300,
    MAX: 900
  };

  var COORD_Y = {
    MIN: 100,
    MAX: 500
  };

  var PRICE = {
    MIN: 1,
    MAX: 1000
  };

  var ROOMS = {
    MIN: 1,
    MAX: 5
  };

  var GUESTS = {
    MIN: 1,
    MAX: 10
  };

  var AD_TOTAL = 8;

  var copiedTitles = TITLES.slice();

  /**
   * getRandomArray - возвращает массив случайной длины с неповторяющимися элементами
   * на основе переданного массива. Минимальная длина нового массива - 1.
   *
   * @param  {Array} array Массив, на основе которого формируется новый массив.
   * @return {Array}       Сформированный массив.
   */
  var getRandomArray = function (array) {
    var result = [];
    var randomLength = window.util.getRandomNumber(1, array.length);
    var clone = array.slice();

    for (var i = 0; i < randomLength; i++) {
      var randomElement = window.util.getRandomElement(clone, true);
      result.push(randomElement);
    }

    return result;
  };

  /**
   * getAuthorAvatar - Возвращает уникальный адрес изображения автора объявления
   * в зависимости от порядкого номера объявления adIndex.
   *
   * @param  {number} adIndex Порядковый номер объявления.
   * @return {string}         Адрес вида img/avatars/user{{xx}}.png, где xx принимает
   * значение {01, 02, ..., 10, ...}.
   */
  var getAuthorAvatar = function (adIndex) {
    return ['img/avatars/user',
      adIndex < 10 ? '0' : '',
      adIndex,
      '.png'
    ].join('');
  };

  /**
   * Объявление, содержит информацию об авторе, координаты расположения
   * и описательную часть.
   * @typedef Ad
   * @type {Object}
   * @property {Object} author - Автор объявления.
   * @property {Object} offer - Описание объявления.
   * @property {Object} location - Координты расположения на карте.
   */

  /**
   * createAd - Создает объект Ad (объявление) с заданными характеристиками.
   *
   * @param  {number} adIndex Порядковый номер объявления.
   * @return {Ad}             Объект Ad (объявление).
   */
  var createAd = function (adIndex) {
    var x = window.util.getRandomNumber(COORD_X.MIN, COORD_X.MAX);
    var y = window.util.getRandomNumber(COORD_Y.MIN, COORD_Y.MAX);
    return {
      author: {
        avatar: getAuthorAvatar(adIndex)
      },

      offer: {
        title: window.util.getRandomElement(copiedTitles, true),
        address: x + ', ' + y,
        price: 1000 * window.util.getRandomNumber(PRICE.MIN, PRICE.MAX),
        type: window.util.getRandomElement(Object.keys(TYPES), false),
        rooms: window.util.getRandomNumber(ROOMS.MIN, ROOMS.MAX),
        guests: window.util.getRandomNumber(GUESTS.MIN, GUESTS.MAX),
        checkin: window.util.getRandomElement(TIMES, false),
        checkout: window.util.getRandomElement(TIMES, false),
        features: getRandomArray(FEATURES),
        description: '',
        photos: []
      },

      location: {
        x: x,
        y: y
      }
    };
  };

  /**
   * createAds - Создает массив объектов Ad.
   *
   * @return {Array.<Ad>}  Массив объектов Ad.
   */
  var createAds = function () {
    var result = [];
    for (var i = 0; i < AD_TOTAL; i++) {
      result.push(createAd(i + 1)); // порядковый номер объявления начинается с 1
    }

    return result;
  };

  window.data = {
    createAds: createAds,
    types: TYPES,
    coordY: COORD_Y
  };
})();
