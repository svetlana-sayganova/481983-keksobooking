'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking';
  var SUCCESS_STATUS = 200;
  var REQUEST_TIMEOUT = 10000;

  var ErrorStatus = {
    400: 'Неверный запрос',
    401: 'Пользователь не авторизован',
    404: 'Ничего на найдено',
    500: 'Ошибка сервера'
  };

  /**
   * setup - Создает новый объект XMLHttpRequest.
   *
   * @param  {function} onLoad  Коллбэк, срабатывает при при успешном выполнении запроса.
   * @param  {function} onError Коллбэк, срабатывает при при неуспешном выполнении запроса.
   * @return {XMLHttpRequest}   Объект XMLHttpRequest.
   */
  var setup = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_STATUS) {
        onLoad(xhr.response);
      } else {
        onError(ErrorStatus[xhr.status]);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = REQUEST_TIMEOUT;

    return xhr;
  };

  /**
   * load - Получает данные с сервера.
   *
   * @param  {function} onLoad
   * @param  {function} onError
   */
  var load = function (onLoad, onError) {
    var xhr = setup(onLoad, onError);

    xhr.open('GET', URL + '/data');
    xhr.send();
  };

  /**
   * save - Отправляет предоставленные данные data на сервер.
   *
   * @param  {*}        data
   * @param  {function} onLoad
   * @param  {function} onError
   */
  var save = function (data, onLoad, onError) {
    var xhr = setup(onLoad, onError);

    xhr.open('POST', URL);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    save: save
  };
})();
