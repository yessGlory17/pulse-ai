import mongoose, { models, Schema } from "mongoose";

const EndpointSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    hostname: { type: String, required: true },
    username: { type: String, required: true },
    // description: { type: String, required: true },
  },
  { timestamps: true }
);

const Endpoint =  models.Endpoint || mongoose.model("Endpoint", EndpointSchema);

export default Endpoint;