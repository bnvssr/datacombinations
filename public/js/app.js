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

  //  console.log($('#dataOnly').is(":checked"));

  var url = "/tst";
  if ($('#allValues').is(':checked')) {
    url += "/allValues";
  }
  if ($('#allPairs').is(':checked')) {
    url += "/allPairs";
  }
  if ($('#allCombinations').is(':checked')) {
    url += "/allCombinations";
  }

  if ($('#dataOnly').is(":checked")) {
    url += "/dataOnly"
  }

  $.ajax({
    url: url,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(testdataTmp),
    dataType: 'json',
    success: function (response) {
      //      console.log('success' + JSON.stringify(response));
      document.getElementById('svg-container').innerHTML = "<pre>" + JSON.stringify(response, null, 2) + "</pre>";
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
  slide();

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
      console.log(response.responseText);
    }
  });
};
