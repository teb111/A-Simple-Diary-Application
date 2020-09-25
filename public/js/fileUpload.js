FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
)
// registering all the plugins cdn that were used in the main.hbs file

FilePond.setOptions({
    stylePanelAspectRatio: 150 / 200,
    imageResizeTargetWidth: 150,
    imageResizeTargetHeight: 200
})

FilePond.parse(document.body); //  <!-- Turn all file input elements into ponds -->