import ConnectDB from "../../../utils/database";
import Contact from "../../../../models/Contact";

export async function DELETE(req, { params }) {
  try {
    await ConnectDB();
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ success: false, message: "Missing ID" }), {
        status: 400,
      });
    }

    const deleted = await Contact.findByIdAndDelete(id);

    if (!deleted) {
      return new Response(JSON.stringify({ success: false, message: "Message not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: "Message deleted successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
