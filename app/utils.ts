export const flatten = (array: any): any[] => {
    return [].concat.apply([], array);
};

export const replaceAll = (find: string, replace: string, fullText: string): string => {
    return fullText.replace(new RegExp(find, 'g'), replace);
}

export const arrayToString = (array: any[]): string => {
    let text = '';
    for (let item of array) { 
        text += (typeof(item) === 'object') ? JSON.stringify(item) + '\n': item + '\n'; 
    }
    return text;
}

export const debug = (text: any): void => {
    document.getElementById('debug').innerText += stringify(text) + '\n';
};

const stringify = (text: any) => {
    return (typeof (text) === 'object') ? JSON.stringify(text) : text;
};