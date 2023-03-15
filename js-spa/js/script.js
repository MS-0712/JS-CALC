window.onload = () => {
    getData('home')
}

const sendReq = (METHOD, URL) => {
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open(METHOD, URL)
        xhr.send()
        xhr.onload = () => {
            resolve(xhr.response);
        }
    })
    return promise
}

const getData = function (link) {
    sendReq('GET', link + '.html').then(data => {
        window.history.pushState({}, "", link)
        if (link === 'home')
            window.history.pushState({}, "", '/')

        document.getElementById('response').innerHTML = data

        let activeTag = document.getElementsByClassName('active')

        if (activeTag.length)
            activeTag[0].classList.remove('active', 'fw-bolder')

        document.getElementsByClassName(link)[0].classList.add('active', 'fw-bolder')
    })
}

//  -----  Same Functionality using fetch API  -----

// const getData = function (link) {
//     const html = fetch(link + '.html').then()

//     html.then(htmlData => {
//         return htmlData.text()
//     }
//     ).then(final => {

//         window.history.pushState({}, "", link)
//         if (link === 'home')
//             window.history.pushState({}, "", '/')

//         document.getElementById('response').innerHTML = final

//         let activeTag = document.getElementsByClassName('active')

//         if (activeTag.length)
//             activeTag[0].classList.remove('active', 'fw-bolder')

//         document.getElementsByClassName(link)[0].classList.add('active', 'fw-bolder')
//     })
//}