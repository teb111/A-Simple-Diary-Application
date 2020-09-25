module.exports = {
    itemStringify: (item = "base64") => {
        return toString(item);
    },

    stripTags: input => {
        return input.replace(/<(?:.|\n)*?>/gm, '');
    },

}