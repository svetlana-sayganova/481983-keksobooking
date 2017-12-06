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

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var minPrices = {
  'flat': 1000,
  'bungalo': 0,
  'house': 5000,
  'palace': 10000
};

var copiedTitles = TITLES.slice();

var ads;
var adIndex = 0;

var map = document.querySelector('.map');
var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
var mapPins = map.querySelector('.map__pins');
var mainPin = map.querySelector('.map__pin--main');

var fragment = document.createDocumentFragment();

var form = document.querySelector('.notice__form');
var fieldsets = form.querySelectorAll('fieldset');
var titleInput = form.querySelector('#title');
var checkinSelect = form.querySelector('#timein');
var checkoutSelect = form.querySelector('#timeout');
var typeSelect = form.querySelector('#type');
var priceInput = form.querySelector('#price');
var roomsSelect = form.querySelector('#room_number');
var guestsSelect = form.querySelector('#capacity');
var currentValue;

var popup;
var popupClose;
var currentTarget;

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
 * renderMapPin - Возвращает DOM-элемент 'Метка объявления на карте',
 * созданный на основе шаблона с заданными свойствами из объекта Ad.
 *
 * @param  {Object} ad        Объект Ad.
 * @param  {number} pinNumber Порядковый номер DOM-элемента 'Метка объявления на карте'
 * @return {Object}           DOM-элемент 'Метка объявления на карте' с заданными свойствами.
 */
var renderMapPin = function (ad, pinNumber) {
  var mapPinElement = mapPinTemplate.cloneNode(true);

  mapPinElement.querySelector('img').src = ad.author.avatar;
  mapPinElement.style.left = ad.location.x - PIN_SIZE.X / 2 + 'px';
  mapPinElement.style.top = ad.location.y + PIN_SIZE.Y + 'px';
  // Присваивает порядковый номер элементу (для получения связи с соответствущим
  // объявлением в массиве Ads)
  mapPinElement.number = pinNumber;

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

/**
 * showMap - создает и показывает элементы 'Метка объявления на карте'
 * и снимает блокировку с формы
 *
 */
var showMap = function () {
  // Создает DOM-элементы 'Метка объявления на карте' и размещает во фрагменте 'fragment'
  for (var i = 0; i < ads.length; i++) {
    fragment.appendChild(renderMapPin(ads[i], i));
  }

  // Добавляет DOM-элементы 'Метка объявления на карте' в блок '.map__pins'
  mapPins.appendChild(fragment);

  map.classList.remove('map--faded');
  form.classList.remove('notice__form--disabled');

  // делает все поля формы доступными
  changeAccessibility(fieldsets);

  // назначает обработчик showPopups на элемент 'Карта',
  // в котором расположены элементы 'Метка объявления на карте'
  mapPins.addEventListener('click', showPopups);

  // удадаляет обработчики с элемента 'Главный пин'
  mainPin.removeEventListener('mouseup', showMap);
  mainPin.removeEventListener('keydown', onMainPinEnterPress);
};

/**
 * showPopups - Подсвечивает активный элемент 'Метка объявления на карте'
 * и показвает соответсвущий ему элемент 'Карточка объявления на карте'.
 *
 * @param  {Object} evt Событие Event.
 */
var showPopups = function (evt) {
  // переменной target присваивает ближайший родительский элемент 'Метка объявления на карте'
  // исходнго элемента, на котором произошло событие
  var target = evt.target.closest('.map__pin');

  if (target && target !== mainPin) {
    // удаляет подсветку с предыдущего активного элемента 'Метка объявления на карте'
    // и соответствующий ему элемент 'Карточка объявления на карте'
    if (currentTarget) {
      currentTarget.classList.remove('map__pin--active');
      popup.remove();
    }
    // добавляет подсветку элементу 'Метка объявления на карте'
    target.classList.add('map__pin--active');
    // переменной currentTarget присваивает элемент 'Метка объявления на карте',
    // находящийся в активном состоянии
    currentTarget = target;

    // по номеру активного элемента создает соответствующий элемент
    // 'Карточка объявления на карте' и размещает на карте
    popup = renderMapCard(ads[currentTarget.number]);
    map.appendChild(popup);

    // ищет кнопку закрытия элеманта 'Карточка объявления на карте'
    // и назначает ему обработчик closePopup (закрытие элемента по клику)
    popupClose = map.querySelector('.popup__close');
    popupClose.addEventListener('click', closePopup);

    // назначает обработчик onPopupEscPress (закрытие элемента по нажатию на клавишу Esc)
    document.addEventListener('keydown', onPopupEscPress);
  }
  // если клик произошел по элементу 'Главный пин', то закрывает открытый попап
  if (popup && target === mainPin) {
    closePopup();
  }
};

/**
 * closePopup - Снимает подсветку с активного элемента 'Метка объявления на карте'
 * и скрывает соответствущий ему элемент 'Карточка объявления на карте'.
 *
 */
var closePopup = function () {
  currentTarget.classList.remove('map__pin--active');
  popup.classList.add('hidden');
  document.removeEventListener('keydown', onPopupEscPress);
};

/**
 * onPopupEscPress - Закрывает элемент 'Карточка объявления на карте'
 * при нажатии клавиши Esc.
 *
 * @param  {Object} evt Событие Event.
 */
var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

/**
 * onMainPinEnterPress - запускает функцию showMap при нажатии клавиши Enter
 * на элементе 'Главный пин'
 *
 * @param  {Object} evt Событие Event.
 */
var onMainPinEnterPress = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    showMap();
  }
};

/**
 * changeAccessibility - Меняет доступность элементов формы на противоположное значение.
 *
 * @param  {Array} array Массив элементов
 */
var changeAccessibility = function (array) {
  array.forEach(function (elem) {
    elem.disabled = (elem.disabled) ? false : true;
  });
};

// Создает объявления
ads = createAds();

// Формирует из DOM-коллекции массив
fieldsets = Array.prototype.slice.call(fieldsets);

// Делает все поля формы недоступными в момент открытия страницы
changeAccessibility(fieldsets);

// Добавляет обработчики на элемент 'Главный пин'
mainPin.addEventListener('mouseup', showMap);
mainPin.addEventListener('keydown', onMainPinEnterPress);

// ---------Задание 14: доверяй, но проверяй---------


/**
 * syncTimes - Синхронизирует время заезда и время выезда путем выбора опции
 * синхронизиуемого списка того же индекса, что и у основного списка.
 *
 * @param  {Object} times1 select -- основной список.
 * @param  {Object} times2 select -- синхронизируемый список.
 */
var syncTimes = function (times1, times2) {
  times2.options[times1.selectedIndex].selected = true;
};

/**
 * syncTypeWithPrice - Устанавливает минимальнную стоимость жилья в зависимости от типа.
 *
 */
var syncTypeWithPrice = function () {
  priceInput.min = minPrices[typeSelect.value];
};

/**
 * syncGuestsWithRooms - В зависимости от количства комнат блокирует недоступное для размещения
 * количество гостей.
 *
 */
var syncGuestsWithRooms = function () {
  guestsSelect.value = (roomsSelect.value === '100') ? '0' : roomsSelect.value;
  currentValue = guestsSelect.value;

  for (var i = 0; i < guestsSelect.options.length; i++) {
    guestsSelect.options[i].disabled = (currentValue === '0') ?
      (guestsSelect.options[i].value !== '0') :
      (guestsSelect.options[i].value > currentValue || guestsSelect.options[i].value === '0');
  }
};

// Синхронизирует необходимые значия до взаимодействия с формой
syncTimes(checkinSelect, checkoutSelect);
syncTypeWithPrice();
syncGuestsWithRooms();

// Синхронизирует время заезда и время выезда
checkinSelect.addEventListener('change', function () {
  syncTimes(checkinSelect, checkoutSelect);
});
checkoutSelect.addEventListener('change', function () {
  syncTimes(checkoutSelect, checkinSelect);
});

// Устанавливает минимальнную стоимость жилья в зависимости от типа
typeSelect.addEventListener('change', syncTypeWithPrice);

// В зависимости от количства комнат блокирует недоступное для размещения
// количество гостей
roomsSelect.addEventListener('change', syncGuestsWithRooms);

// Выделяет неверно заполненные поля красной рамкой
form.addEventListener('invalid', function (evt) {
  evt.target.style.outline = '2px solid red';
}, true);

// Выводит сообщение при неправильно заполненном заголовке
titleInput.addEventListener('invalid', function () {
  var inputError;
  if (titleInput.validity.tooShort) {
    inputError = 'Заголовок должен состоять минимум из 30 символов';
  } else if (titleInput.validity.tooLong) {
    inputError = 'Заголовок не должен превышать 100 символов';
  } else if (titleInput.validity.valueMissing) {
    inputError = 'Поле обязательно для заполнения';
  } else {
    inputError = '';
  }
  titleInput.setCustomValidity(inputError);
});

// Выводит сообщение при неправильно заполненной цене
priceInput.addEventListener('invalid', function () {
  var inputError;
  if (priceInput.validity.rangeUnderflow) {
    inputError = 'Цена для данного типа жилья не может быть менее ' + minPrices[typeSelect.value] + ' p.';
  } else if (priceInput.validity.rangeOverflow) {
    inputError = 'Цена не может быть более 1000000 р.';
  } else if (priceInput.validity.valueMissing) {
    inputError = 'Поле обязательно для заполнения';
  } else {
    inputError = '';
  }
  priceInput.setCustomValidity(inputError);
});
