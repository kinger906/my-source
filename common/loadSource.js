const loadSource = {
    // 加载JS或CSS文件，将其附加到html中
    loadJsCss: (path, type) => {
        fetch(path)
            .then(response => response.text())
            .then(jsCode => {
                const scriptElement = document.createElement(type);
                scriptElement.textContent = jsCode;
                document.body.appendChild(scriptElement);
            }).catch(error => {
                console.error(`加载${path}出错:`, error);
            });
    },
    // 加载html文件，并提取JS和CSS文件返回
    loadHtml: (path, callback) => {
        console.log(path, 'html')
        fetch(path)
            .then(response => response.text())
            .then(html => {
                const arrOutJS = loadSource.getJsCss(html, 'script')
                const arrOutCss = loadSource.getJsCss(html, 'link')
                callback && callback(html, arrOutJS, arrOutCss)
            })
            .catch(error => {
                console.error(`加载${path}出错:`, error);
            });
    },
    // 提取html里的JS或CSS文件
    getJsCss: (htmlString, type) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const elementTags = doc.getElementsByTagName(type);
        const arrSource = []
        for (const tag of elementTags) {
            if (tag.hasAttribute('src')) {
                const tagSrc = tag.getAttribute('src');
                arrSource.push(tagSrc)
            }
            if (tag.getAttribute('rel') === 'stylesheet') {
                const tagSrc = tag.getAttribute('href');
                arrSource.push(tagSrc)
            }
        }
        return arrSource;
    },
    // 批量加载JS或CSS文件，自动补充相对路径
    loadGroupJsCss: (arrSource, type, relativeUrl, addType = 'load') => {
        arrSource.forEach((soureItem) => {
            let currentPath = soureItem
            if (!soureItem.includes('http')) {
                currentPath = relativeUrl + soureItem
            }
            if (addType === 'load') {
                loadSource.loadJsCss(currentPath, type)
            }
            else {
                loadSource.appendJsCss(currentPath, type)
            }
        })
    },
    // 添加JS和CSS文件-附加的方式
    appendJsCss: (srcPath) => {
        const strFile = `${srcPath}?d=${new Date().getTime()}`
        let strJS = ''
        if (type === 'script') {
            strJS = `<script src="${srcPath}"><\/script>`
        }
        else {
            strJS = `<link rel="stylesheet" href="${srcPath}"><\/link>`
        }
        document.write(strJS);
    }
}

window.loadSource = loadSource