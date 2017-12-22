'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  var filtersContainer = document.querySelector('.map__filters-container');
  var filters = filtersContainer.querySelectorAll('.map__filter');
  var filteredAds = [];

  var PriceValues = {
    MIDDLE_START: 10000,
    MIDDLE_FINAL: 50000
  };

  /**
   * filterByType - Фильтрует объявления ads по типу жилья.
   *
   * @param  {Array.<Ad>} ads         Массив объявлений до фильтрации.
   * @param  {string}     filterValue Тип жилья.
   * @return {Array.<Ad>}             Массив объявлений после фильтрации.
   */
  var filterByType = function (ads, filterValue) {
    return ads.filter(function (ad) {
      return ad.offer.type === filterValue;
    });
  };

  /**
   * filterByRooms - Фильтрует объявления ads по количеству комнат.
   *
   * @param  {Array.<Ad>} ads         Массив объявлений до фильтрации.
   * @param  {string}     filterValue Количество комнат.
   * @return {Array.<Ad>}             Массив объявлений после фильтрации.
   */
  var filterByRooms = function (ads, filterValue) {
    return ads.filter(function (ad) {
      return ad.offer.rooms.toString() === filterValue;
    });
  };

  /**
   * filterByGuests - Фильтрует объявления ads по количеству гостей.
   *
   * @param  {Array.<Ad>} ads         Массив объявлений до фильтрации.
   * @param  {string}     filterValue Количество гостей.
   * @return {Array.<Ad>}             Массив объявлений после фильтрации.
   */
  var filterByGuests = function (ads, filterValue) {
    return ads.filter(function (ad) {
      return ad.offer.guests.toString() === filterValue;
    });
  };

  /**
   * filterByPrice - Фильтрует объявления ads по цене.
   *
   * @param  {Array.<Ad>} ads         Массив объявлений до фильтрации.
   * @param  {string}     filterValue Ценовой интервал.
   * @return {Array.<Ad>}             Массив объявлений после фильтрации.
   */
  var filterByPrice = function (ads, filterValue) {
    return ads.filter(function (ad) {
      var priceInterval = {
        'low': ad.offer.price < PriceValues.MIDDLE_START,
        'middle': ad.offer.price >= PriceValues.MIDDLE_START && ad.offer.price <= PriceValues.MIDDLE_FINAL,
        'high': ad.offer.price > PriceValues.MIDDLE_FINAL
      };
      return priceInterval[filterValue];
    });
  };

  /**
   * filterByFeatures - Фильтрует объявления ads по характеристикам жилья.
   *
   * @param  {Array.<Ad>} ads          Массив объявлений до фильтрации.
   * @param  {string}     featureValue Характеристика жилья.
   * @return {Array.<Ad>}              Массив объявлений после фильтрации.
   */
  var filterByFeatures = function (ads, featureValue) {
    return ads.filter(function (ad) {
      return ad.offer.features.indexOf(featureValue) >= 0;
    });
  };

  var filterNameToFilter = {
    'housing-type': filterByType,
    'housing-rooms': filterByRooms,
    'housing-guests': filterByGuests,
    'housing-price': filterByPrice
  };

  filtersContainer.addEventListener('change', function () {
    window.util.debounce(window.map.update, DEBOUNCE_INTERVAL);
  });

  /**
   * filterAds - Возвращает отфильтрованный массив объявлений.
   *
   * @param  {Arr.<Ad>} ads Массив объявлений до фильтрации.
   * @return {Arr.<Ad>}     Отфильтрованный массив объявлений.
   */
  var filterAds = function (ads) {
    filteredAds = ads.slice();

    // Формирует массив из фильтров, которые были применены (фильтр был применен,
    // если его значение отличается от значения 'any')
    var appliedFilters = Array.from(filters).filter(function (filter) {
      return filter.value !== 'any';
    });

    // Формирует массив из выбранных характеристик объявления
    var checkedFeatures = Array.from(filtersContainer.querySelectorAll('.map__filter-set input[name="features"]:checked'));

    // Фильтрует объявления по каждому примененному фильтру
    appliedFilters.forEach(function (filter) {
      filteredAds = filterNameToFilter[filter.name](filteredAds, filter.value);
    });

    // Фильтрует объявления по каждой выбранной характеристике
    checkedFeatures.forEach(function (feature) {
      filteredAds = filterByFeatures(filteredAds, feature.value);
    });

    return filteredAds;
  };

  window.filterAds = filterAds;
})();
