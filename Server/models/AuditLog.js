import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userName: {
      type: String,
      default: "System",
    },
    userRole: {
      type: String,
      default: "admin",
    },
    action: {
      type: String,
      required: true,
    },
    entity: {
      type: String,
      default: "",
    },
    entityId: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const AuditLog = mongoose.model("AuditLog", auditLogSchema);
export default AuditLog;
