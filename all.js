let allData = [];
let filterData = [];
// axios取得資料
function getData() {
  axios
    .get('https://hexschool.github.io/js-filter-data/data.json')
    .then(function (response) {
      allData = response.data;
      renderData(allData);
    })
    .catch(function (error) {
      console.log(error);
    });
}
getData();
// 渲染
const productList = document.querySelector('.showList');
function renderData(array) {
  let str = '';
  array.forEach(function (item) {
    str += `<tr>
          <td>${item.作物名稱}</td>
          <td>${item.市場名稱}</td>
          <td>${item.上價}</td>
          <td>${item.中價}</td>
          <td>${item.下價}</td>
          <td>${item.平均價}</td>
          <td>${item.交易量}</td>
        </tr>`;
  });
  productList.innerHTML = str;
}
// 種類篩選
const typeBTN = document.querySelector('.button-group');
const BTNstyle = document.querySelectorAll('.button-group .btn');
typeBTN.addEventListener('click', function (e) {
  let type = e.target.dataset.type;
  if (e.target.nodeName === 'BUTTON') {
    BTNstyle.forEach(function (item) {
      item.classList.remove('btnActive');
    });
    e.target.classList.add('btnActive');
    if (type === 'all') {
      renderData(allData);
      searchHint.innerHTML = '';
    } else if (type !== 'all') {
      filterData = allData.filter((item) => item.種類代碼 === type);
      renderData(filterData);
      return filterData;
      searchHint.innerHTML = '';
    }
  }
});
//搜尋
const searchInput = document.querySelector('#crop');
const searchBTN = document.querySelector('.search');
const searchHint = document.querySelector('#searchHint');
function search() {
  if (searchInput.value === '' || searchInput.value.trim() === '') {
    alert('請輸入作物名稱！');
    return;
  }
  filterData = allData.filter(
    //因json資料中有null值必須做比較子過濾
    (item) => item.作物名稱 && item.作物名稱.match(searchInput.value.trim())
  );
  searchHint.innerHTML = `<p>以下為『${searchInput.value.trim()}』搜尋結果</p>`;
  BTNstyle.forEach(function (item) {
    item.classList.remove('btnActive');
  });
  renderData(filterData);
  if (filterData.length === 0) {
    productList.innerHTML = `<tr><td colspan="6" class="text-center p-3">查詢不到交易資訊 QQ</td></tr>`;
    BTNstyle.forEach(function (item) {
      item.classList.remove('btnActive');
    });
    return;
  }
  return filterData;
}

searchInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    search();
    console.log(filterData);
  }
});
searchBTN.addEventListener('click', function () {
  search();
  console.log(filterData);
});
//資料排序










