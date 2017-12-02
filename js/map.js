'use strict';

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

var PIN_SIZE = {
  X: 40,
  Y: 40
};

var copiedTitles = TITLES.slice();

var adIndex = 0;

var map = document.querySelector('.map');
var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
var mapPins = map.querySelector('.map__pins');

var fragment = document.createDocumentFragment();

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
 * @param  {Array} array Массив, из которого возвращается элемент.
 * @param  {boolean} key Способ, которым возвращается элемент.
 * True - выбранный элемент удаляется из массива, false - не удаляется.
 * @return {*}           Элемент массива.
 */
var getRandomElement = function (array, key) {
  var randomElementIndex = getRandomNumber(0, array.length - 1);
  var randomElement = array[randomElementIndex];

  if (key) {
    array.splice(randomElementIndex, 1);
  }

  return randomElement;
};

/**
 * getRandomArray - возвращает массив случайной длины с неповторяющимися элементами
 * на основе переданного массива. Минимальная длина нового массива - 1.
 *
 * @param  {Array} array Массив, на основе которого формируется новый массив.
 * @return {Array}       Сформированный массив.
 */
var getRandomArray = function (array) {
  var randomArray = [];
  var randomLength = getRandomNumber(1, array.length);
  var copiedArray = array.slice();

  for (var i = 0; i < randomLength; i++) {
    var randomArrayElement = getRandomElement(copiedArray, true);
    randomArray.push(randomArrayElement);
  }

  return randomArray;
};

/**
 * getAuthorAvatar - Возвращает уникальный адрес изображения автора объявления
 * в зависимости от порядкого номера объявления adIndex.
 *
 * @return {string}  Адрес вида img/avatars/user{{xx}}.png, где xx принимает
 * значение {01, 02, ..., 10, ...}.
 */
var getAuthorAvatar = function () {
  var path = 'img/avatars/user';
  adIndex++;

  return (adIndex < 10) ? (path + '0' + adIndex + '.png') : (path + adIndex + '.png');
};

/**
 * createAd - Создает объект Ad (объявление) с заданными характеристиками.
 *
 * @return {Object}  Объект Ad (объявление).
 */
var createAd = function () {
  var x = getRandomNumber(COORD_X.MIN, COORD_X.MAX);
  var y = getRandomNumber(COORD_Y.MIN, COORD_Y.MAX);
  return {
    author: {
      avatar: getAuthorAvatar()
    },

    offer: {
      title: getRandomElement(copiedTitles, true),
      address: x + ', ' + y,
      price: 1000 * getRandomNumber(PRICE.MIN, PRICE.MAX),
      type: getRandomElement(Object.keys(TYPES), false),
      rooms: getRandomNumber(ROOMS.MIN, ROOMS.MAX),
      guests: getRandomNumber(GUESTS.MIN, GUESTS.MAX),
      checkin: getRandomElement(TIMES, false),
      checkout: getRandomElement(TIMES, false),
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
 * @return {Array}  Массив объектов Ad.
 */
var createAds = function () {
  var adArray = [];
  for (var i = 0; i < AD_TOTAL; i++) {
    var ad = createAd();
    adArray.push(ad);
  }

  return adArray;
};

/**
 * renderMapCard - Возвращает DOM-элемент 'Метка объявления на карте',
 * созданный на основе шаблона с заданными свойствами из объекта Ad.
 *
 * @param  {Object} ad Объект Ad.
 * @return {Object}    DOM-элемент 'Метка объявления на карте' с заданными свойствами.
 */
var renderMapPin = function (ad) {
  var mapPinElement = mapPinTemplate.cloneNode(true);

  mapPinElement.querySelector('img').src = ad.author.avatar;
  mapPinElement.style.left = ad.location.x - PIN_SIZE.X / 2 + 'px';
  mapPinElement.style.top = ad.location.y + PIN_SIZE.Y + 'px';

  return mapPinElement;
};

/**
 * renderMapCard - Возвращает DOM-элемент 'Карточка объявления на карте',
 * созданный на основе шаблона с заданными свойствами из объекта Ad.
 *
 * @param  {Object} ad Объект Ad.
 * @return {Object}    DOM-элемент 'Карточка объявления на карте' с заданными свойствами.
 */
var renderMapCard = function (ad) {
  var mapCardElement = mapCardTemplate.cloneNode(true);
  var paragraphs = mapCardElement.querySelectorAll('p');
  var featureList = mapCardElement.querySelector('.popup__features');

  mapCardElement.querySelector('h3').textContent = ad.offer.title;
  mapCardElement.querySelector('small').textContent = ad.offer.address;
  mapCardElement.querySelector('.popup__price').textContent = ad.offer.price + ' \u20BD/ночь';
  mapCardElement.querySelector('h4').textContent = TYPES[ad.offer.type];
  paragraphs[2].textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  paragraphs[3].textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

  featureList.innerHTML = '';
  for (var i = 0; i < ad.offer.features.length; i++) {
    var featureElement = '<li class="feature feature--' + ad.offer.features[i] + '"></li>';
    featureList.insertAdjacentHTML('afterbegin', featureElement);
  }

  paragraphs[4].textContent = ad.offer.description;
  mapCardElement.querySelector('img').src = ad.author.avatar;

  return mapCardElement;
};

// Показывает блок '.map'
map.classList.remove('map--faded');

// Создает объявления
var ads = createAds();

// Создает DOM-элементы 'Метка объявления на карте' и размещает во фрагменте 'fragment'
for (var i = 0; i < ads.length; i++) {
  fragment.appendChild(renderMapPin(ads[i]));
}

// Добавляет DOM-элементы 'Метка объявления на карте' в блок '.map__pins'
mapPins.appendChild(fragment);

// Создает новый фрагмент 'fragment'
fragment = document.createDocumentFragment();

// Создает DOM-элемент 'Карточка объявления на карте' и размещает во фрагменте 'fragment'
fragment.appendChild(renderMapCard(ads[0]));

// Добавляет DOM-элемент 'Карточка объявления на карте' в блок '.map'
map.appendChild(fragment);
