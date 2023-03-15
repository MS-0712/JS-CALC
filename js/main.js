const mathFunctions = [
    { viewName: 'abs', mathName: 'Math.abs' },
    { viewName: 'floor', mathName: 'Math.floor' },
    { viewName: 'ceil', mathName: 'Math.ceil' },
    { viewName: 'sinh', mathName: 'Math.sinh' },
    { viewName: 'cosh', mathName: 'Math.cosh' },
    { viewName: 'tanh', mathName: 'Math.tanh' },
    { viewName: 'sin(', mathName: 'Math.sin(' },
    { viewName: 'cos(', mathName: 'Math.cos(' },
    { viewName: 'tan(', mathName: 'Math.tan(' },
    { viewName: 'log', mathName: 'Math.log10' },
    { viewName: 'ln', mathName: 'Math.log' },
    { viewName: '√', mathName: 'Math.sqrt' }
];

const specialCharacterCases = [
    { caseRegex : /[0-9]π[0-9]/, symbolRegex: /π/, replaceWith: "*3.14*"},
    { caseRegex : /π[0-9]/, symbolRegex: /π/, replaceWith: "3.14*"},
    { caseRegex : /[0-9]π/, symbolRegex: /π/, replaceWith: "*3.14"},
    { caseRegex : /π/, symbolRegex: /π/, replaceWith: "3.14"},
    { caseRegex : /e[0-9]/, symbolRegex: /e/, replaceWith: "2.78*"},
    { caseRegex : /[0-9]e/, symbolRegex: /e/, replaceWith: "*2.78"},
    { caseRegex : /e[^a-z]/, symbolRegex: /e/, replaceWith: "2.78"},
    { caseRegex : /\^/, symbolRegex: /\^/, replaceWith: "**"}
];

let flag = false;

document.addEventListener('keydown', (event) => {
    let key = event.key;
    let expression = document.getElementById('inp')
    switch (key) {
        case 'Escape':
            expression.value = ''
            break;
        case 'Enter':
            evalRes()
            break;
    }
})

window.onload = () => document.getElementById('inp').focus()

function factorial(n) {
    let ans = 1;
    for (let i = 2; i <= n; i++)
        ans = ans * i;
    return ans;
}

function toggleTrigo() {
    if (document.getElementById("trigo").classList.contains('visually-hidden')) {
        document.getElementById("trigo").classList.remove("visually-hidden")
        document.getElementById("func").classList.add("visually-hidden")
    }
    else
        document.getElementById("trigo").classList.add("visually-hidden")
}

function toggleFun() {
    if (document.getElementById("func").classList.contains('visually-hidden')) {
        document.getElementById("func").classList.remove("visually-hidden")
        document.getElementById("trigo").classList.add("visually-hidden")
    }
    else
        document.getElementById("func").classList.add("visually-hidden")
}

function updateInp(input) {
    let value = input.value
    let state = document.getElementById("inp")
    let expression = state.value + 'N'

    switch (value) {
        case "C":
            state.value = ""
            state.placeholder = ''
            break;

        case "B":
            state.value = state.value.substr(0, state.value.length - 1)
            break;

        case "N":
            let oc = expression.length, n = ''
            for (let i = oc - 2; i >= 0; i--) {
                if (/[0-9]/.test(expression[i]))
                    n += expression[i];
                else
                    break
            }
            n = parseInt(n.split('').reverse().join(''), 10)
            let regex = new RegExp(n + "N");
            state.value = expression.replace(regex, "-" + n)
            break;

        default:
            if (flag)
                state.value = ''
            state.style.setProperty("color", "rgb(129, 129, 129)", "important")
            state.value += value
            flag = false
            break;
    }
}

function memoryMan(input) {
    let memory = 0
    let value = parseInt(document.getElementById("inp").value, 10)

    switch (input) {
        case "MR":
            document.getElementById("inp").value = localStorage.getItem('mem')
            break;
        case "MS":
            localStorage.setItem('mem', value)
            break;
        case "MC":
            localStorage.clear()
            break;
        case "M+":
            memory = parseInt(localStorage.getItem('mem'), 10)
            memory += value
            localStorage.setItem('mem', memory)
            break;
        case "M-":
            memory = localStorage.getItem('mem')
            memory -= value
            localStorage.setItem('mem', memory)
            break;
    }
}

function factorialHandler(expression) {
    let oc = expression.indexOf('!')
    if (expression[oc - 1] == ")") {
        let n = ''
        for (let i = oc - 2; expression[i] != "("; i--)
            n += expression[i];

        n = n.split('').reverse().join('')
        let ans = factorial(eval(n))
        return expression.replace("(" + n + ")!", ans)
    } else {
        let n = ''
        for (let i = oc - 1; i >= 0; i--) {
            if (/[0-9]/.test(expression[i]))
                n += expression[i];
            else
                break
        }

        n = parseInt(n.split('').reverse().join(''), 10)
        let ans = factorial(n)
        let regex = new RegExp("(" + n + ")!");
        return expression.replace(regex, ans)
    }
}

function evalRes() {
    let state = document.getElementById("inp")
    let expression = state.value
    try {
        if (expression != '') {
            while (expression.includes('!'))
                expression = factorialHandler(expression)

            mathFunctions.forEach(element => {
                if (expression.includes(element.viewName))
                    expression = expression.replaceAll(element.viewName, element.mathName)
            });

            specialCharacterCases.forEach(element => {
                if(element.caseRegex.test(expression))
                    expression = expression.replace(element.symbolRegex, element.replaceWith)
            });

            state.value = eval(expression)
            flag = true
            state.style.setProperty("color", "black", "important")
        } else {
            state.value = ''
            state.placeholder = 'Please enter expression'
        }
    } catch (e) {
        console.log(e);
        state.value = ''
        state.placeholder = e.name
    }
}