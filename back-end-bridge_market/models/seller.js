const mongoose = require("mongoose")
const User = require("./user") // Assuming you have a User model

const sellerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    storeName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    // Add other seller-specific fields here
  },
  { timestamps: true },
)

sellerSchema.statics.create = async function (sellerData) {
  try {
    const user = await User.findById(sellerData.user)

    if (!user) {
      throw new Error("User not found.")
    }

    if (user.role !== "seller") {
      throw new Error("User is not a seller.")
    }

    const seller = new this(sellerData)
    return await seller.save()
  } catch (error) {
    throw error
  }
}

sellerSchema.statics.update = async function (id, updateData) {
  try {
    const seller = await this.findById(id)

    if (!seller) {
      throw new Error("Seller not found.")
    }

    const user = await User.findById(seller.user)

    if (!user) {
      throw new Error("User not found.")
    }

    if (user.role !== "seller") {
      throw new Error("User is not a seller.")
    }

    Object.assign(seller, updateData)
    return await seller.save()
  } catch (error) {
    throw error
  }
}

const Seller = mongoose.model("Seller", sellerSchema)

module.exports = Seller