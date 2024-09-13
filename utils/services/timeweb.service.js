// only server use!!!
export const timewebService = {
    uploadFile,
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
        console.log('response',response)
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


