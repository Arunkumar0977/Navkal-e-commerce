import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page       = parseInt(searchParams.get("page")  || "1");
    const limit      = parseInt(searchParams.get("limit") || "12");
    const category   = searchParams.get("category");
    const search     = searchParams.get("search");
    const featured   = searchParams.get("featured");
    const bestSeller = searchParams.get("bestSeller");
    const newArrival = searchParams.get("newArrival");
    const trending   = searchParams.get("trending");
    const sort       = searchParams.get("sort") || "createdAt";
    const minPrice   = searchParams.get("minPrice");
    const maxPrice   = searchParams.get("maxPrice");

    const where: any = { isActive: true };
    if (category)   where.category  = { slug: category };
    if (search)     where.OR        = [
      { name:        { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
    if (featured   === "true") where.featured   = true;
    if (bestSeller === "true") where.bestSeller  = true;
    if (newArrival === "true") where.newArrival  = true;
    if (trending   === "true") where.trending    = true;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    const orderBy: any =
      sort === "price_asc"  ? { price: "asc"  } :
      sort === "price_desc" ? { price: "desc" } :
      { createdAt: "desc" };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where, orderBy,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          variants: true,
          _count:   { select: { reviews: true } },
          reviews:  { where: { approved: true }, select: { rating: true }, take: 100 },
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({ products, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { name, description, price, comparePrice, images, categoryId, stock, sku, tags, variants, ...rest } = body;
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now()}`;
    const product = await prisma.product.create({
      data: {
        name, slug, description,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        images, categoryId,
        stock: parseInt(stock),
        sku, tags: tags || [],
        ...rest,
        variants: variants?.length ? { create: variants } : undefined,
      },
      include: { category: true, variants: true },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    if (error instanceof Response) return error;
    if (error.code === "P2002") return NextResponse.json({ error: "SKU already exists" }, { status: 409 });
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
