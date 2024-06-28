export const makeBold = (text) => {
    return `<b>${text.replaceAll("\"", "")}</b>`;
};

const makeList = (text) => {
    return text.split("\n").map(item => `<li>${item}</li>>`).join("\n")
}

export const makeUnorderedList = (text) => {
    return `<ul>${makeList(text)}</ul>`
}

export const makeOrderedList = (text) => {
    return `<ol>${makeList(text)}</ol>`
}
