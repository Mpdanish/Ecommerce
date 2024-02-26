import mongoose from 'mongoose';


const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userdb",
        required: true,
      },
    walletBalance: {
        type: Number,
        default: 0,
    },
    transactions: [
        {
            amount: {
                type: Number,
                required: true,
            },
            type:{
                type: String,
                required: true,
            },
            transactionDate: {
                type: Date,
                default: Date.now(),
            },
        }
    ]
})


const Walletdb = mongoose.model('walletdb', walletSchema);

export default Walletdb;
