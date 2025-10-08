import ConnectDB from "../../utils/database";
import contact from "../../../models/Contact";

export async function POST(req) {
  try {
    const { name, email, phone, message } = await req.json();
    await ConnectDB();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Please fill all required fields" }), { status: 400 });
    }

    await contact.create({ name, email, phone, message });
    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
  }
}
