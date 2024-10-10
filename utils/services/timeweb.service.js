// only server use!!!
export const timewebService = {
    uploadFile,
    removeFile
};

async function uploadFile(file, path, name) {
    let blob = new File([file.buffer], name, {
        type: file.mimetype,
    })
    const form = new FormData()
    form.append("files", blob)
    const requestOptions = {
        method: 'POST',
        headers: { "Authorization": "Bearer " + process.env.timewebToken},
        body: form
    };
    return fetch(`https://api.timeweb.cloud/api/v1/storages/buckets/${process.env.timewebBucket}/object-manager/upload?path=${path}`, requestOptions).then(response => {
        return response.text().then(text => {
            const data = text && JSON.parse(text);
            if (!response.ok) {
                return { success: false, ...data }
            } else {
                return {file:  `${process.env.timewebURL}${path}/${name}`}
            }
        })
    });
}

async function removeFile(file, path) {
    const form = {
        source: [
            file.includes(file) ? path + file.split(path)[1] : file
        ]
    }
    const requestOptions = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json', "Authorization": "Bearer " + process.env.timewebToken},
        body: JSON.stringify(form)
    };
    return fetch(`https://api.timeweb.cloud/api/v1/storages/buckets/${process.env.timewebBucket}/object-manager/remove`, requestOptions).then(response => {
        console.log('response',response)
        return response.text().then(text => {
            const data = text && JSON.parse(text);
            if (!response.ok) {
                return { success: false, ...data }
            } else {
                return {success: true}
            }
        })
    });
}


