import mongoose from "mongoose";

const BeritaSchema = new mongoose.Schema(
  {
    judul: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    konten: { type: String, required: true },
    coverImage: { type: String, default: "" },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
    publishedAt: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.models.Berita || mongoose.model("Berita", BeritaSchema);
