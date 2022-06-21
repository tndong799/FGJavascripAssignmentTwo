const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


const options = [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022];


const select = $('#yearsOfBirth');
const selectYearFilter = $('#yearsFilter');
const selectGenderFilter = $('#genderFilter');
const submit = $('#submit');
const form = $('#form');
const tableBody = $('#tableBody');

let data = [];
let dataFilter = [];

const filterOptions = {
    yearsFilter: '',
    genderFilter: ''
}

const loadYearsOfBirthOptions = (options) => {
    let optionsSelect = ''
    for(option of options){
        optionsSelect += `<option value=${option}>${option}</option>`
    }
    select.innerHTML += optionsSelect;
}

const loadYearsOfBirthFilterOptions = (data) => {
    const cloneData = [...data].filter((value, index, self) =>
        index === self.findIndex((t) => (
            t.yearsOfBirth === value.yearsOfBirth
        ))
    ).sort((a,b) => a.yearsOfBirth - b.yearsOfBirth)
    

    let optionsSelect = ''

    for(d of cloneData){
        optionsSelect += `<option value=${d.yearsOfBirth}>${d.yearsOfBirth}</option>`
    }
    selectYearFilter.innerHTML += optionsSelect;
}

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

// const sortData = (data, field, direction = 'asc') => {

// }

const loadData = () => {
    data = JSON.parse(localStorage.getItem('data'));
}

const showData = (data) => {
    let dataEl = ''
    if(data){
        for(let [index, val] of data.entries()){
            dataEl += `<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
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
            <td class="px-6 py-4">
                ${val.createTime}
            </td>
        </tr>`
        }
    }
    tableBody.innerHTML = dataEl
}

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
        formProps['createTime'] = new Date().toLocaleDateString("en-US", {hour: '2-digit', minute: '2-digit'});
        !data ?  data = [formProps] : data.push(formProps);
        localStorage.setItem('data',JSON.stringify(data));
        form.reset();
        render();
    }
})

selectYearFilter.addEventListener('change', (e) => {
    // Select 1 điều kiện
    // // Nếu chọn vào option Năm sinh thì sẽ show ra hết data.
    // if(!e.target.value){
    //     showData(data);
    //     return
    // }

    // if(data){
    //     dataFilter = data.filter(d => d.yearsOfBirth === e.target.value)
    // }
    // showData(dataFilter)


    // Select 2 điều kiện
    filterOptions[e.target.name] = e.target.value
    filterData(filterOptions)
    showData(dataFilter)
})

selectGenderFilter.addEventListener('change', (e) => {
    // Select 1 điều kiện
    // Nếu chọn vào option Giới tính thì sẽ show ra hết data.
    // if(!e.target.value){
    //     showData(data);
    //     return
    // }

    // if(data){
    //     dataFilter = data.filter(d => d.gender === e.target.value)
    // }
    // showData(dataFilter)


    // Select 2 điều kiện
    filterOptions[e.target.name] = e.target.value
    filterData(filterOptions)
    showData(dataFilter)
})

const render = () => {
    loadYearsOfBirthOptions(options)
    loadData()
    loadYearsOfBirthFilterOptions(data)
    showData(data);
}

render();
