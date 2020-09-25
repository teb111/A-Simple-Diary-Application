const mongoose = require('mongoose');

const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const Schema = mongoose.Schema;

const DiarySchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },

    body: {
        type: String,
        required: true,
    },

    img: {
       type: Buffer,
       required: true,
    },

    imgType: {
        type: String,
        required: true,
    },
    
});

DiarySchema.virtual('coverImagePath').get(function() {
    if(this.img != null && this.imgType != null){
        return `data:${this.imgType};charset=utf-8;base64,${this.img.toString('base64')}`;
    }
});

DiarySchema.set('toObject', { virtuals: true });    
DiarySchema.set('toJSON', { virtuals: true });

DiarySchema.plugin(mongooseLeanVirtuals);

module.exports = mongoose.model('Diary', DiarySchema);

