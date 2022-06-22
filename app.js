const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


const options = [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022];


const select = $('#yearsOfBirth');
const selectYearFilter = $('#yearsFilter');
const selectGenderFilter = $('#genderFilter');
const submit = $('#submit');
const form = $('#form');
const tableBody = $('#tableBody');

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


// LOAD OPTIONS OF YEAR SELECT FORM
const loadYearsOfBirthOptions = (options) => {
    let optionsSelect = ''
    for(option of options){
        optionsSelect += `<option value=${option}>${option}</option>`
    }
    select.innerHTML += optionsSelect;
}

// LOAD OPTIONS OF YEAR SELECT FILTER
const loadYearsOfBirthFilterOptions = (data) => {
    // lọc các data có trùng năm sinh và sắp xếp tăng dần theo năm sinh
    const cloneData = [...data].filter((value, index, self) =>
        index === self.findIndex((t) => (
            t.yearsOfBirth === value.yearsOfBirth
        ))
    ).sort((a,b) => a.yearsOfBirth - b.yearsOfBirth)
    console.log(cloneData)

    let optionsSelect = ''

    for(d of cloneData){
        optionsSelect += `<option value=${d.yearsOfBirth}>${d.yearsOfBirth}</option>`
    }
    selectYearFilter.innerHTML += optionsSelect;
}

// SHOW MESSAGE WHEN HAVE ALEART
const showToast = (message) => {
    const toast = $('#toast');
    const messageEl = $('#message');
    if(message){
        messageEl.innerText = message;
        toast.className = toast.className.replace('right-[-100%]','right-[20px]');
    }

    setTimeout(() => {
        toast.className =  toast.className.replace('right-[20px]','right-[-100%]');
        messageEl.innerText = ''
    }, 2000)

}


// GET DATA FROM LOCAL STORAGE
const loadData = () => {
    data = JSON.parse(localStorage.getItem('data'));
    dataFilter = [...data]
}

// SET DATA TO LOCAL STORAGE
const setData = (data) => {
    localStorage.setItem('data',JSON.stringify(data));
}

// SHOW DATA IN TABLE
const showData = (data) => {
    let dataEl = ''
    if(data){
        for(let [index, val] of data.entries()){
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
        }
    }
    tableBody.innerHTML = dataEl
}

// HANDLE FILTER DATA
const filterData = (options) => {
    const {yearsFilter, genderFilter} = options

    if(yearsFilter && genderFilter){
        dataFilter = data.filter((val) => {
            if(val.yearsOfBirth == yearsFilter && val.gender == genderFilter)
            return val
        })
    }else if(!yearsFilter && !genderFilter){
        dataFilter = data.filter((val) => {
            return val
        })
    }
    else{
        dataFilter = data.filter((val) => {
            if(val.yearsOfBirth == yearsFilter || val.gender == genderFilter)
            return val
        })
    }
    
}

// HANDLE SORT DATA
const sortData = ({fieldSort ,sort}) => {
    if(fieldSort && sort === 'asc'){
        dataFilter = dataFilter.sort((a,b) => (a[fieldSort] > b[fieldSort]) ? 1 : ((b[fieldSort] > a[fieldSort]) ? -1 : 0))
    }else if(fieldSort && sort === 'desc'){
        dataFilter = dataFilter.sort((a,b) => (a[fieldSort] < b[fieldSort]) ? 1 : ((b[fieldSort] < a[fieldSort]) ? -1 : 0))
    }else{
        dataFilter = [...data]
    }
}

// HANDLE DELETE DATA
const handleRemoveData = (id) => {
    data = data.filter(val => val.id !== id)
    setData(data)
    showToast('Bạn đã xóa thành công')
    render()
}


// HANDLE FORM WHEN SUBMIT
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

// HANLE ON CHANGE SELECT YEAR FILTER
selectYearFilter.addEventListener('change', (e) => {
    // Select 2 điều kiện
    filterOptions[e.target.name] = e.target.value
    filterData(filterOptions)
    showData(dataFilter)
})

// HANDLE ON CHANGE SELECT GENDER FILTER
selectGenderFilter.addEventListener('change', (e) => {
    // Select 2 điều kiện
    filterOptions[e.target.name] = e.target.value
    filterData(filterOptions)
    showData(dataFilter)
})

selectFieldSort.addEventListener('change', (e) => {
    sortConditions[e.target.name] = e.target.value
    sortData(sortConditions);
    showData(dataFilter)

})
sortDirec.addEventListener('change', (e) => {
    sortConditions[e.target.name] = e.target.value
    sortData(sortConditions);
    showData(dataFilter)
})

const render = () => {
    loadYearsOfBirthOptions(options)
    loadData()
    loadYearsOfBirthFilterOptions(data)
    showData(data);
}

render();
