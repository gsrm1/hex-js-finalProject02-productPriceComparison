let allData = [];
let filterData = [];
const url = 'https://hexschool.github.io/js-filter-data/data.json';

// axios取得資料
function getData() {
  axios.get(url)
    .then(function (response) {
      allData = response.data;
      filterData = [...allData]; //因getData執行時資料載入為非同步，當瀏覽器刷新時使用資料排序filterData還是空的，須透過淺拷貝[...]複製一份allData給filterData，也不影響allData原始數據
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
      filterData = allData;
      renderData(filterData);
      searchHint.innerHTML = '';
    } else if (type !== 'all') {
      filterData = allData.filter((item) => item.種類代碼 === type);
      renderData(filterData);
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
  searchInput.value = '';
}
searchInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    search();
  }
});
searchBTN.addEventListener('click', function () {
  search();
});

//資料排序
const priceSortIcon = document.querySelector('.js-sort-advanced');
priceSortIcon.addEventListener('click', function (e) {
  if (e.target.nodeName === 'I') {
    const sortPrice = e.target.getAttribute('data-price');
    const sortCaret = e.target.getAttribute('data-sort');
    showSortData(sortPrice, sortCaret);
  }
});
function showSortData(sortPrice, sortCaret) {
  if (sortCaret === 'up') {
    filterData.sort(function (a, b) {
      return a[sortPrice] - b[sortPrice];
    });
  } else {
    filterData.sort(function (a, b) {
      return b[sortPrice] - a[sortPrice];
    });
  }
  renderData(filterData);
  console.log(filterData);
}

//下拉表單排序
const priceSortSelect = document.querySelector('#js-select');
priceSortSelect.addEventListener('change', function (e) {
  const selectOption = priceSortSelect.options[priceSortSelect.selectedIndex];
  const selectPrice = selectOption.getAttribute('data-price');
  const selectCaret = selectOption.getAttribute('data-sort');
  showSortData(selectPrice, selectCaret);
});

//下拉表單排序(Mobile)
const priceSortSelectMB = document.querySelector('#js-mobile-select');
priceSortSelectMB.addEventListener('change', function (e) {
  const selectOption =
    priceSortSelectMB.options[priceSortSelectMB.selectedIndex];
  const selectPriceMB = selectOption.getAttribute('data-price');
  const selectCaretMB = selectOption.getAttribute('data-sort');
  showSortData(selectPriceMB, selectCaretMB);
});