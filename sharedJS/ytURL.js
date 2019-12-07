
export function getYtId(urlStr) {
    let ytId
    const url = new URL(urlStr)
    if (urlStr.startsWith('https://www.youtube.com/watch')) {
        ytId = url.searchParams.get('v')
    } else if (urlStr.startsWith('https://youtu.be/')) {
        ytId = url.pathname.split('/')[1]
    }
    return ytId
}
