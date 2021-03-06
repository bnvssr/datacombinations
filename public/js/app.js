function downloadTestcases() {

  if (document.getElementById('downloadPlaceholder') === null) {
    alert("Nothing to download");
    return;
  };

  var testcases = document.getElementById('downloadPlaceholder').innerHTML;

  download(testcases, 'temp.json', 'application/json');
};

function generateTestcases() {

  var testdataTmp = {
    'categories': [],
    'testcases': []
  };

  Array.from(document.getElementsByClassName('category_data')).forEach(function (cat) {
    var category = {
      'name': cat.getElementsByTagName('input')[0].value,
      'value': cat.getElementsByTagName('textarea')[0].value.split('\n')
    };

    // loose all blank values
    category.value = category.value.filter(function (item) {
      return item !== "";
    });

    testdataTmp.categories.push(category);
  });

  var url = "/tst";
  var datatype = 'text';
  if ($('#allValues').is(':checked')) {
    url += "/allValues";
  }
  if ($('#allPairs').is(':checked')) {
    url += "/allPairs";
  }
  if ($('#allCombinations').is(':checked')) {
    url += "/allCombinations";
  }

  if ($('#json').is(":checked")) {
    datatype = 'json';
    url += "/json"
  } else if ($('#xml').is(":checked")) {
    datatype = 'xml';
    url += "/xml"
  }

  $.ajax({
    url: url,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(testdataTmp),
    dataType: datatype,
    success: function (response) {

      switch (datatype) {
        case 'text':
          document.getElementById('svg-container').innerHTML = response;
          break;
        case 'json':
          document.getElementById('svg-container').innerHTML = "<pre>" + JSON.stringify(response, null, 2) + "</pre>";
          break;
        case 'xml':
          document.getElementById('svg-container').innerHTML = "<pre>" + JSON.stringify(response, null, 2) + "</pre>";
          break;
        case 'download':
          document.getElementById('svg-container').innerHTML = "<pre>" + JSON.stringify(response, null, 2) + "</pre>";
          break;
      }
      //      console.log(document.getElementById('downloadPlaceholder').innerHTML);
    },
    error: function (response) {
      //      console.log('error' + JSON.stringify(response));
      document.getElementById('svg-container').innerHTML = response.responseText;
    }
  });
}

function addCategory() {

  var tabIndexCat = $('div.cat_header').length * 2 + 1;
  var tabIndexValues = tabIndexCat + 1;

  var cat = "<div class='category_data'><div class='cat_header'><span> +  Category name: </span><input type='text' tabIndex='" + tabIndexCat + "'> <input type='button' class='remove' value='remove' onclick='removeCategory(this);' tabIndex='-1' /></div><div class ='catdata' ><textarea class = 'data' tabIndex = '" + tabIndexValues + "' ></textarea></div></div><p/>"

  $('#data').append(cat);

};

function removeCategory(_this) {
  $(_this).parent().parent().remove();
};

function insertTestData() {
  $.ajax({
    url: '/testdata',
    type: 'GET',
    contentType: 'application/json',
    dataType: 'json',
    success: function (response) {
      var cats = $(".category_data"); // locate all divs for input data
      for (i = 0; i < cats.length; i++) { // loop through category divs
        $(cats[i]).find("input[type='text']")[0].value = response.categories[i].name // enter category name
        //        cats[i].value = response.categories[i].name
        for (j = 0; j < response.categories[i].value.length; j++) { // loop through all values of current category
          $(cats[i]).find("textarea")[0].value += response.categories[i].value[j] + "\n"; // enter value
        }
      };
    },
    error: function (response) {
      //      console.log('error' + JSON.stringify(response));
      //      console.log(response.responseText);
    }
  });
};
