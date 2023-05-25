const mongoose =  require('mongoose')
const { Schema } = mongoose;

const NotesSchema = new Schema({
    title: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    tag: {
        type: String,
        default: "General"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    // updatedAt:{
    //     type: new Date()
    // }
});

module.exports = mongoose.model('notes',NotesSchema)