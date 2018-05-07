fakeData()

let model = {
    data: {
        name: '',
        number: 0,
        id: ''
    },
    fetch(id) {
        return axios.get(`/books/${id}`).then((response) => {
            this.data = response.data
            return response
        })
    },
    updata(data) {
        let id = this.data.id
        return axios.put(`/books/${id}`, data).then((response) => {
            this.data = response.data
            return response
        })
    }
}

let view = {
    el: '#app',
    template: `
        <div>
        书名：《 __name__》 
        数量： <span id = "number"> __number__ </span>
        </div> 
        <div>
        <button id = "addOne"> 加1 </button>
        <button id = "minusOne"> 减1 </button> 
        <button id = "reset"> 归零 </button> 
        </div>
    `,
    render(data) {
        let html = this.template.replace('__name__', data.name)
            .replace('__number__', data.number)
        $(this.el).html(html)
    }
}

var controller = {
    init(options) {
        let view = options.view
        let model = options.model
        this.view = view
        this.model = model
        this.view.render(this.model.data)
        this.bindEvents()
        this.model.fetch(1).then(() => {
            this.view.render(this.model.data)
        })
    },
    addOne() {
        var oldNumber = $('#number').text()
        var newNumber = oldNumber - 0 + 1
        this.model.updata({
            number: newNumber
        }).then(() => {
            this.view.render(this.model.data)
        })
    },
    minusOne() {
        var oldNumber = $('#number').text()
        var newNumber = oldNumber - 0 - 1
        this.model.updata({
            number: newNumber
        }).then(() => {
            this.view.render(this.model.data)
        })
    },
    bindEvents() {
        //this === controller
        $(this.view.el).on('click', '#addOne', this.addOne.bind(this))
        $(this.view.el).on('click', '#minusOne', this.minusOne.bind(this))
        $(this.view.el).on('click', '#reset', this.reset.bind(this))
    }
}

controller.init({
    view: view,
    model: model
})


//在真正返回response之前使用
function fakeData() {
    let book = {
        name: 'JavaScript 高级程序设计',
        number: 2,
        id: 1
    }
    axios.interceptors.response.use(function (response) {
        //let config = response.config
        //let {method, url, data} = config  //这里data是请求的data
        //在ES6语法下，下面一句 === 上面两句
        let {
            config: {
                method,
                url,
                data
            }
        } = response

        if (url === '/books/1' && method === 'get') {
            response.data = book
        } else if (url === '/books/1' && method === 'put') {
            data = JSON.parse(data)
            Object.assign(book, data)
            response.data = book
        }
        return response
    })
}

/*上面是用axios模拟出来的假后台*/