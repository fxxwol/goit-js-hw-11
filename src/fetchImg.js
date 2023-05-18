const axios = require('axios/dist/browser/axios.cjs');
const BASE_URL = 'https://pixabay.com/api/'

export async function fetchImg(query) {
    try {
        const response = await axios.get(`${BASE_URL}`, {
            params: {
                key: '36535933-aff750008a9fa1f4912b521bb',
                q: `${query}`,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true
            }
        });

        return response.data;
    } catch (error) {
        console.error(error);
    }
}
// const axios = require('axios/dist/browser/axios.cjs');
// const BASE_URL = 'https://pixabay.com/api/'
// async function fetchImg() {
//     try {
//         const response = await axios.get(`${BASE_URL}`, {
//             params: {
//                 key: '36535933-aff750008a9fa1f4912b521bb',
//                 q: `cat`,
//                 image_type: 'photo',
//                 orientation: 'horizontal',
//                 safesearch: true
//             }
//         });
//         console.log(response.data);
//     } catch (error) {
//         console.error(error);
//     }
// }