export function json(payload: any, ext: any = {}) {
    return {...ext,
        headers: { ...ext.headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }
}

export function patch(ext: any = {}) {
    return {...ext,
        method: "PATCH"
    }
}

export function header(headers: any) {
    return {
        headers: headers
    }
}

export function post(ext: any = {}) {
    return {...ext,
        method: "POST"
    }
}