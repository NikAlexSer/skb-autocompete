let dataArray = [],
    $input = $('.input-container input'),
    $inputContainer = $('.input-container'),
    $citiesList = $('.cities-list'),
    urls = {
      getData: '/getCityData',
      postData: '/addCity',
    };

$input
    .on('input', getCitiesList)
    .on('focus', focusInput)
    .on('focusout', unfocusInput)
    .on('keydown', keyboardProcessing);

$inputContainer
    .on('click', '.cities-list-item', function() {
      $input.val($(this).text());
      $citiesList.addClass('hidden')
    })
    .on('mouseover', '.cities-list-item', function () {
      $('.cities-list-item').removeClass('focused');
      $(this).addClass('focused')
    })
    .on('mousedown', '.cities-add-item', function () {
      addData();
});

$('.error-server-retry').on('click', function() {
  getData();
});

function focusInput() {
  $(this).select();
  $input.removeClass('error');
  $('div.error').addClass('hidden');
  getData()
}

function unfocusInput() {
  if (!$input.val()) {
    return true;
  }
  else if ($('.cities-list-item').length > 0) {
    $input.removeClass('error');
    $input.val($('.focused').text());
    $citiesList.addClass('hidden')
  }
  else {
    $input.addClass('error');
    $('.error').removeClass('hidden');
    $citiesList.addClass('hidden')
  }
}

function renderList(data, count, val) {
  let source = '{{#each items}}<div class="cities-list-item">{{City}}</div>' +
               '{{else}}<div class="notfound">Не найдено</div>{{/each}}' +
               '<div class="cities-add-item">+ Добавить «{{text}}»</div>' +
               '{{#if count}}<div class="manyresults">Показано 10 из {{count}} найденных городов. <br>Уточните запрос, чтобы увидеть остальные.</div>{{/if}}',
      template = Handlebars.compile(source),
      context = {
        items: data.slice(0, 10),
        count: count > 10 ? count : 0,
        text: val
  };

  let html = template(context);
  $citiesList.removeClass('hidden').html(html);
  $('.cities-list-item').first().addClass('focused')
}

function getCitiesList() {
  let val = $(this).val();

  if (val) {
    let foundCities = dataArray
                        .filter(item => item.City.search(val) + 1 > 0)
                        .sort(function (firstElem, secondElem) {
                          if (firstElem.City > secondElem.City) return 1;
                          if (firstElem.City < secondElem.City) return -1;
                        });

    renderList(foundCities, foundCities.length, val)
  }
  else {
    $citiesList.addClass('hidden')
  }
}

function getData() {
  $.ajax({
    url: urls.getData,
    type: 'GET',
    beforeSend: function () {
      $('.loader-container').removeClass('hidden')
    },
    success: function (res) {
      $('.loader-container').addClass('hidden');
      $('.error-server').addClass('hidden');
      dataArray = JSON.parse(res);
    },
    error: function () {
      $('.error-server').removeClass('hidden');
    }
  })
}

function addData() {
  $.ajax({
    url: urls.postData,
    type: 'POST',
    data: {
      Id: dataArray.length,
      City: $input.val(),
    },
    success: function (res) {
      $citiesList.addClass('hidden');
    },
  });
}

function keyboardProcessing() {
  let index = $('.focused').index(),
      $citiesList = $('.cities-list-item');

  const TAB = 9,
        ARROWUP = 38,
        ARROWDOWN = 40,
        ENTER = 13,
        ESC = 27;

  switch (event.keyCode) {
    case TAB:
    case ARROWUP:
    case ARROWDOWN:
      event.preventDefault();
      keyboardNavigate(event.keyCode, $citiesList, index);
      break;
    case ESC:
      $citiesList.addClass('hidden');
      break;
    case ENTER:
      $input.val($('.focused').text());
      $citiesList.addClass('hidden');
      $('.cities-add-item').addClass('hidden');
      break;
    default:
      break;
  }
}

function keyboardNavigate(keyCode, $citiesList, index) {
  const TAB = 9,
        ARROWDOWN =40;

  $citiesList.removeClass('focused');
  let cityIndex = 0;
  if (keyCode === ARROWDOWN || keyCode === TAB) {
    cityIndex = (index === $citiesList.length - 1) ? 0 : index + 1;
  }
  else {
    cityIndex = (index === 0) ? -1 : index - 1;
  }
  $citiesList.eq(cityIndex).addClass('focused');
}

