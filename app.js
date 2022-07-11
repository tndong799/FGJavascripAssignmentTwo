const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


// const options = [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022];


const select = $('#yearsOfBirth');
const selectYearFilter = $('#yearsFilter');
const selectGenderFilter = $('#genderFilter');
const submit = $('#submit');
const form = $('#form');
const tableBody = $('#tableBody');

const toast = $('#toast');
const messageEl = $('#message');

const selectFieldSort = $('#fieldSort');
const sortDirec = $('#sort');

let data = [];
let dataFilter = [];

const filterOptions = {
    yearsFilter: '',
    genderFilter: ''
}

const sortConditions = {
    fieldSort: '',
    sort: 'asc'
}


// Load các option cho ô select trong form nhập
const loadYearsOfBirthOptions = (yearStart, yearEnd = new Date().getFullYear()) => {
    let optionsSelect = '<option value="">Năm sinh</option>'
    for(let i = yearStart; i <= yearEnd; i++){
        optionsSelect += `<option value=${i}>${i}</option>`
    }
    select.innerHTML = optionsSelect;
}

// Load các option cho ô select trong filter
const loadYearsOfBirthFilterOptions = (data) => {
    // lọc các data có trùng năm sinh và sắp xếp tăng dần theo năm sinh
    const dataFilteredAndSorted = [...data].filter((value, index, self) =>
        index === self.findIndex((t) => (
            t.yearsOfBirth === value.yearsOfBirth
        ))
    ).sort((a,b) => a.yearsOfBirth - b.yearsOfBirth)

    let optionsSelect = '<option value="">Năm sinh</option>'

    for(d of dataFilteredAndSorted){
        optionsSelect += `<option value=${d.yearsOfBirth}>${d.yearsOfBirth}</option>`
    }
    selectYearFilter.innerHTML = optionsSelect;
}

// Hiển thị message thông báo
const showToast = (message) => {
    if(message){
        messageEl.innerText = message;
        toast.className = toast.className.replace('right-[-100%]','right-[20px]');
    }

    setTimeout(() => {
        toast.className =  toast.className.replace('right-[20px]','right-[-100%]');
        messageEl.innerText = ''
    }, 2000)

}


// Lấy data từ localStorage về
const loadData = () => {
    return JSON.parse(localStorage.getItem('data')) || [];
}

// Lưu data lên localStorage
const setData = (data) => {
    localStorage.setItem('data',JSON.stringify(data));
}

// Hàm hiển thị data trong table
const showData = (data) => {
    let dataEl = ''
    if(data.length > 0){
        data.forEach((val, index) => {
            dataEl += `<tr class="group bg-white border-b text-sm text-gray-600 hover:bg-gray-50 ">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                ${++index}
            </th>
            <td class="px-6 py-4">
                ${val.fullname}
            </td>
            <td class="px-6 py-4">
                ${val.yearsOfBirth}
            </td>
            <td class="px-6 py-4">
                ${val.gender}
            </td>
            <td class="px-6 py-4 relative">
                ${val.createTime}
                <button class='absolute right-4 ml-4 text-red-400 hidden group-hover:inline-flex' onclick=(handleRemoveData('${val.id}'))>
                    <svg class="w-5 h-5 text-red-400 hover:text-red-600 transition-all duration-200 ease" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><title>Trash</title><path d="M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M80 112h352"/><path d="M192 112V72h0a23.93 23.93 0 0124-24h80a23.93 23.93 0 0124 24h0v40M256 176v224M184 176l8 224M328 176l-8 224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
                </button>
            </td>
        </tr>`
        })
    }else{
        dataEl = `
            <tr class="group bg-white border-b text-sm text-gray-600 hover:bg-gray-50 ">
                <td class="px-6 py-4 text-center" colspan="5">
                    Không tìm thấy kết quả
                </td>
            </tr>
        `
    }
    tableBody.innerHTML = dataEl
}

// Hàm xử lý lọc data theo điều kiện
const filterData = (options) => {
    const {yearsFilter, genderFilter} = options

    if(yearsFilter && genderFilter){
        return data.filter((val) => {
            if(val.yearsOfBirth == yearsFilter && val.gender == genderFilter)
            return val
        })
    }else if(!yearsFilter && !genderFilter){
        return [...data]
    }
    else{
        return data.filter((val) => {
            if(val.yearsOfBirth == yearsFilter || val.gender == genderFilter)
            return val
        })
    }
    
}

// Hàm sắp xếp data
const sortData = ({fieldSort ,sort}) => {
    // Sắp xếp tăng dần
    if(fieldSort && sort === 'asc'){
        if(fieldSort === 'createTime'){
            return dataFilter.sort((a, b) => new Date(a[fieldSort]).getTime() - new Date(b[fieldSort]).getTime())
        }
        return dataFilter.sort((a,b) => (a[fieldSort] > b[fieldSort]) ? 1 : ((b[fieldSort] > a[fieldSort]) ? -1 : 0))
    }

    // sắp xếp giảm dần
    if(fieldSort && sort === 'desc'){
        if(fieldSort === 'createTime'){
            return dataFilter.sort((a, b) => new Date(b[fieldSort]).getTime() - new Date(a[fieldSort]).getTime())
        }
        return dataFilter.sort((a,b) => (a[fieldSort] < b[fieldSort]) ? 1 : ((b[fieldSort] < a[fieldSort]) ? -1 : 0))
    }

    if(!fieldSort){
        return dataFilter
    }
}

// Hàm xóa data theo Id
const handleRemoveData = (id) => {
    let index = data.map( val => val.id).indexOf(id);
    const dataDelete = data.splice(index,1)
    setData(data)
    showToast('Bạn đã xóa thành công')
    render()
}


// Xử lý submit data form
form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);
    const {fullname, yearsOfBirth, gender} = formProps;
    let isError = false
    if(!fullname){
        isError = true
        showToast('Hãy nhập tên của bạn')
        return
    }
    if(!yearsOfBirth){
        isError = true
        showToast('Hãy chọn ngày sinh của bạn')
        return
    }
    if(!gender){
        isError = true
        showToast('Hãy chọn giới tính của bạn')
        return
    }

    if(!isError){
        let randomString = (Math.random() + 1).toString(36).substring(7)
        formProps['id'] = randomString;
        formProps['createTime'] = new Date().toLocaleDateString("en-US", {hour: '2-digit', minute: '2-digit'});
        !data ?  data = [formProps] : data.push(formProps);
        setData(data)
        showToast('Thêm mới thành công')
        form.reset();
        render();
    }
})

// Lọc theo năm sinh
selectYearFilter.addEventListener('change', (e) => {
    // Select 2 điều kiện
    filterOptions[e.target.name] = e.target.value
    dataFilter = filterData(filterOptions)
    dataFilter = sortData(sortConditions)
    showData(dataFilter)
})

// Lọc theo giới tính
selectGenderFilter.addEventListener('change', (e) => {
    // Select 2 điều kiện
    filterOptions[e.target.name] = e.target.value
    dataFilter = filterData(filterOptions)
    dataFilter = sortData(sortConditions)
    showData(dataFilter)
})

// Chọn cột để sắp xếp
selectFieldSort.addEventListener('change', (e) => {
    sortConditions[e.target.name] = e.target.value
    dataFilter = filterData(filterOptions);
    dataFilter = sortData(sortConditions);
    showData(dataFilter)

})

// Chọn hướng để sắp xếp (tăng dần or giảm dần)
sortDirec.addEventListener('change', (e) => {
    sortConditions[e.target.name] = e.target.value
    dataFilter = filterData(filterOptions);
    sortConditions.fieldSort ? dataFilter = sortData(sortConditions) : showToast('Vui lòng chọn trường sắp xếp')
    
    showData(dataFilter)
})

// Hàm render app
const render = () => {
    loadYearsOfBirthOptions(1990)
    data = loadData()
    dataFilter = [...data]
    loadYearsOfBirthFilterOptions(data)
    showData(data)
}

render();