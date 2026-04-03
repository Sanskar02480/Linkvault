import mongoose from 'mongoose'

const bookmarkSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },  
  url: { type: String, required: true },
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  tags: { type: [String], default: [] },
  embedding: { type: [Number], default: [] },
  note: { type: String, default: "" }
}, { timestamps: true })

const Bookmark = mongoose.model("Bookmark", bookmarkSchema)

export default Bookmark