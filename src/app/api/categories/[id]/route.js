import { NextResponse } from "next/server";
import connectDB from "../../../utils/database";
import Category from "@/Models/Category";

export async function DELETE(req, context) {
  await connectDB();

  try {
    const { id } = await context.params;

    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET(req, context) {
  await connectDB();
  try {
    const { id } = await context.params; 
    const category = await Category.findById(id).select("name slug");

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, category });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  await connectDB();
 
  try {
    const { id } = await params;
    const body = await req.json();
      const updateData = {
      name: body.name,
      slug: body.slug,
    };

    const edit = await Category.findByIdAndUpdate(id , updateData , {new: true});

    if (!edit) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 });
    }

    return NextResponse.json(
      { success: true, 
        message: "Category edited" ,
        category: edit, });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message }, 
      { status: 500 });
  }
}
