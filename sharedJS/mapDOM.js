
export function mapDOM(element, toJson) {
    const treeObject = {}

    // If string convert to document Node
    if (typeof element === 'string') {
        const parser = new DOMParser()
        const docNode = parser.parseFromString(element, 'text/xml')
        element = docNode.firstChild
    }

    // Recursively loop through DOM elements and assign properties to object
    function treeHTML(element, object) {
        object.type = element.nodeName
        const nodeList = element.childNodes
        if (nodeList != null) {
            if (nodeList.length) {
                object.content = []
                for (let i = 0; i < nodeList.length; i++) {
                    if (nodeList[i].nodeType === 3) {
                        object.content.push(nodeList[i].nodeValue)
                    } else {
                        object.content.push({})
                        treeHTML(nodeList[i], object.content[object.content.length - 1])
                    }
                }
            }
        }
        if (element.attributes != null) {
            if (element.attributes.length) {
                object.attributes = {}
                for (let i = 0; i < element.attributes.length; i++) {
                    object.attributes[element.attributes[i].nodeName] = element.attributes[i].nodeValue
                }
            }
        }
    }
    treeHTML(element, treeObject)

    return (toJson) ? JSON.stringify(treeObject) : treeObject
}

export function fromHtmlFav(htmlStrFav) {
    if (!htmlStrFav) {
        return []
    }
    const regex = /HREF="([^"]*)"/g
    const found = htmlStrFav.match(regex)
    const arr = []
    found.forEach(href => {
        arr.push(href.match(/"([^"]*)"/)[1])
    })
    return arr
}
