const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // 1. Clear existing data
  console.log("Clearing existing data...");
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.mediaMention.deleteMany({});
  await prisma.siteSetting.deleteMany({});
  await prisma.newsletterSubscriber.deleteMany({});
  await prisma.admin.deleteMany({});

  // 2. Create Admin user
  console.log("Seeding admins...");
  const admin = await prisma.admin.create({
    data: {
      name: "Super Admin",
      email: "admin@aprakashco.com",
      password: "$2a$12$R.S6C0tTqO5f/rQpE6YwWunB74F3L1jC/k5N007H0N/tD8G3lJ46y", // bcrypt hash of "prakash1928"
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });
  console.log(`Created admin: ${admin.email}`);

  // 3. Create Categories
  console.log("Seeding categories...");
  const catTeaCoffee = await prisma.category.create({
    data: {
      name: "Tea & Coffee",
      slug: "tea-coffee",
      description: "Fine single-origin Darjeeling teas, heritage CTC blends, and artisanal roasted coffees.",
      sortOrder: 1,
    },
  });

  const catJams = await prisma.category.create({
    data: {
      name: "Jams & Preserves",
      slug: "jams",
      description: "Pure fruit preserves, heritage orange marmalades, and mountain wildflower honeys.",
      sortOrder: 2,
    },
  });

  const catCheese = await prisma.category.create({
    data: {
      name: "Cheese & Dairy",
      slug: "cheese",
      description: "Artisanal hand-crafted cheeses matured in cold high-altitude cellars.",
      sortOrder: 3,
    },
  });

  const catConfectionery = await prisma.category.create({
    data: {
      name: "Confectionery",
      slug: "confectionery",
      description: "Traditional sweets, handmade chocolates, and heritage tea biscuits.",
      sortOrder: 4,
    },
  });

  const catSouvenirs = await prisma.category.create({
    data: {
      name: "Souvenirs & Gifts",
      slug: "souvenirs",
      description: "Heritage gift boxes, tea tins, and custom brass tea infusers.",
      sortOrder: 5,
    },
  });

  console.log("Categories seeded successfully!");

  // 4. Create Products
  console.log("Seeding products...");

  // --- TEA & COFFEE ---
  const p1 = await prisma.product.create({
    data: {
      name: "Darjeeling First Flush Tea",
      slug: "darjeeling-first-flush-tea",
      shortDesc: "The 'Champagne of Teas'. Hand-plucked first harvest of spring with a light, floral liquor.",
      description: "Direct from the misty heights of Darjeeling, our First Flush represents the pinnacle of teamaking. Plucked in early spring, these young leaves deliver a light, amber infusion with an exquisite floral aroma, delicate muscatel notes, and a crisp, clean finish. A true connoisseur's choice.",
      categoryId: catTeaCoffee.id,
      basePrice: 450,
      comparePrice: 550,
      images: JSON.stringify(["/products/first-flush.jpg"]),
      sku: "TEA-DARJ-FF",
      weight: "250g",
      ingredients: "100% Premium Darjeeling Black Tea Leaves",
      shelfLife: "12 Months",
      origin: "Darjeeling, West Bengal",
      hsnCode: "09024020",
      gstPercent: 5,
      isActive: true,
      isFeatured: true,
      isBestseller: true,
      stock: 120,
      lowStockThreshold: 10,
    },
  });

  await prisma.productVariant.createMany({
    data: [
      { productId: p1.id, label: "100g", price: 200, comparePrice: 250, stock: 50, sku: "TEA-DARJ-FF-100" },
      { productId: p1.id, label: "250g", price: 450, comparePrice: 550, stock: 40, sku: "TEA-DARJ-FF-250" },
      { productId: p1.id, label: "500g", price: 850, comparePrice: 1000, stock: 30, sku: "TEA-DARJ-FF-500" },
    ],
  });

  const p2 = await prisma.product.create({
    data: {
      name: "Heritage Blend Roasted Coffee",
      slug: "heritage-blend-coffee",
      shortDesc: "Medium-dark roast premium Arabica & Robusta blend with dark chocolate notes.",
      description: "Our signature blend since 1950. We slow-roast premium high-elevation Arabica beans along with a touch of washed Robusta to create a full-bodied, deeply aromatic coffee. Features complex tasting notes of rich dark chocolate, roasted hazelnut, and a sweet caramel finish.",
      categoryId: catTeaCoffee.id,
      basePrice: 380,
      comparePrice: 420,
      images: JSON.stringify(["/products/heritage-coffee.jpg"]),
      sku: "COF-HERT-BLND",
      weight: "250g",
      ingredients: "100% Roasted Coffee Beans (Arabica & Robusta Blend)",
      shelfLife: "9 Months",
      origin: "Chikmagalur, Karnataka",
      hsnCode: "09012100",
      gstPercent: 5,
      isActive: true,
      isFeatured: true,
      isBestseller: false,
      stock: 80,
      lowStockThreshold: 8,
    },
  });

  await prisma.productVariant.createMany({
    data: [
      { productId: p2.id, label: "250g (Beans)", price: 380, comparePrice: 420, stock: 30, sku: "COF-HER-250B" },
      { productId: p2.id, label: "250g (Filter Ground)", price: 380, comparePrice: 420, stock: 30, sku: "COF-HER-250G" },
      { productId: p2.id, label: "500g (Beans)", price: 720, comparePrice: 800, stock: 20, sku: "COF-HER-500B" },
    ],
  });

  // --- JAMS & PRESERVES ---
  const p3 = await prisma.product.create({
    data: {
      name: "Himalayan Wildflower Honey Jam",
      slug: "himalayan-wildflower-honey-jam",
      shortDesc: "Artisanal forest berry jam sweetened exclusively with pure organic mountain honey.",
      description: "Crafted in small batches in our kitchen using ripe forest blackberries, raspberries, and wild blueberries. Instead of refined sugar, we use organic Himalayan wildflower honey as a natural sweetener, creating a rich, deeply fruity, and wholesomely sweet preserve.",
      categoryId: catJams.id,
      basePrice: 280,
      comparePrice: null,
      images: JSON.stringify(["/products/honey-jam.jpg"]),
      sku: "JAM-HIM-HNY",
      weight: "350g",
      ingredients: "Wild Blackberries, Raspberries, Blueberries, Organic Himalayan Honey, Fruit Pectin, Lemon Juice",
      shelfLife: "12 Months",
      origin: "Shimla Hills, Himachal Pradesh",
      hsnCode: "20079910",
      gstPercent: 12,
      isActive: true,
      isFeatured: true,
      isBestseller: true,
      stock: 45,
      lowStockThreshold: 5,
    },
  });

  await prisma.productVariant.createMany({
    data: [
      { productId: p3.id, label: "250g Jar", price: 210, comparePrice: null, stock: 25, sku: "JAM-HNY-250" },
      { productId: p3.id, label: "350g Jar", price: 280, comparePrice: null, stock: 20, sku: "JAM-HNY-350" },
    ],
  });

  const p4 = await prisma.product.create({
    data: {
      name: "Heritage Orange Marmalade",
      slug: "heritage-orange-marmalade",
      shortDesc: "Traditional bitter-sweet English marmalade made with fresh Seville oranges.",
      description: "Prepared using an authentic 1930s family recipe. We hand-cut the peels of select Seville oranges to give this marmalade its signature chunky texture and beautiful bitter-sweet balance. Perfect on warm buttered toast or glaze for holiday bakes.",
      categoryId: catJams.id,
      basePrice: 240,
      comparePrice: 280,
      images: JSON.stringify(["/products/marmalade.jpg"]),
      sku: "JAM-ORG-MARM",
      weight: "350g",
      ingredients: "Seville Oranges, Cane Sugar, Water, Lemon Juice",
      shelfLife: "18 Months",
      origin: "Kalimpong, West Bengal",
      hsnCode: "20079100",
      gstPercent: 12,
      isActive: true,
      isFeatured: false,
      isBestseller: true,
      stock: 12, // Low stock on purpose for testing alerts
      lowStockThreshold: 15,
    },
  });

  await prisma.productVariant.createMany({
    data: [
      { productId: p4.id, label: "350g Jar", price: 240, comparePrice: 280, stock: 12, sku: "JAM-MAR-350" },
    ],
  });

  // --- CHEESE & DAIRY ---
  const p5 = await prisma.product.create({
    data: {
      name: "Artisan Aged Cheddar Cheese",
      slug: "artisan-aged-cheddar",
      shortDesc: "Sharp, crumbly white cheddar matured for 12 months in natural stone cellars.",
      description: "Our signature cheddar is crafted by hand using raw milk from grass-fed cows. It is aged for a minimum of 12 months in cold cellars, allowing it to develop a sharp, nutty flavour profile, beautiful crystalline crunch, and rich crumbly texture.",
      categoryId: catCheese.id,
      basePrice: 620,
      comparePrice: 700,
      images: JSON.stringify(["/products/cheddar.jpg"]),
      sku: "CHS-AGD-CHDR",
      weight: "200g",
      ingredients: "Pasteurized Cow Milk, Salt, Vegetarian Rennet, Cheese Cultures",
      shelfLife: "4 Months (Keep Refrigerated)",
      origin: "Kurseong Hills, West Bengal",
      hsnCode: "04069000",
      gstPercent: 12,
      isActive: true,
      isFeatured: true,
      isBestseller: true,
      stock: 18,
      lowStockThreshold: 5,
    },
  });

  await prisma.productVariant.createMany({
    data: [
      { productId: p5.id, label: "200g Block", price: 620, comparePrice: 700, stock: 10, sku: "CHS-CHD-200" },
      { productId: p5.id, label: "500g Block", price: 1450, comparePrice: 1600, stock: 8, sku: "CHS-CHD-500" },
    ],
  });

  // --- CONFECTIONERY ---
  const p6 = await prisma.product.create({
    data: {
      name: "Traditional Pistachio Ladoo",
      slug: "traditional-pistachio-ladoo",
      shortDesc: "Rich, melt-in-mouth traditional Indian sweet prepared with premium Iranian pistachios and pure A2 Ghee.",
      description: "A heritage confection that has graced royal celebrations. We roast premium gram flour in pure, fragrant A2 cow ghee, sweeten it delicately with unrefined jaggery, and fold in generous helpings of crushed Iranian pistachios, green cardamom, and saffron. Packaged in our beautiful heritage tin.",
      categoryId: catConfectionery.id,
      basePrice: 320,
      comparePrice: 380,
      images: JSON.stringify(["/products/ladoo.jpg"]),
      sku: "SWE-PST-LAD",
      weight: "400g",
      ingredients: "Iranian Pistachios, Gram Flour, Pure A2 Cow Ghee, Unrefined Jaggery, Green Cardamom, Saffron",
      shelfLife: "30 Days",
      origin: "Jaipur, Rajasthan",
      hsnCode: "17049090",
      gstPercent: 5,
      isActive: true,
      isFeatured: true,
      isBestseller: true,
      stock: 75,
      lowStockThreshold: 10,
    },
  });

  await prisma.productVariant.createMany({
    data: [
      { productId: p6.id, label: "400g Box", price: 320, comparePrice: 380, stock: 45, sku: "SWE-LAD-400" },
      { productId: p6.id, label: "800g Box", price: 600, comparePrice: 700, stock: 30, sku: "SWE-LAD-800" },
    ],
  });

  // --- SOUVENIRS ---
  const p7 = await prisma.product.create({
    data: {
      name: "Heritage Brass Tea Infuser",
      slug: "heritage-brass-tea-infuser",
      shortDesc: "Handmade traditional solid brass tea infuser with an ornate leaf handle.",
      description: "Individually handcrafted by master metalsmiths in Rajasthan. Made from lead-free, food-grade solid brass, this heritage infuser features a fine-mesh container perfect for whole-leaf teas, and an exquisite handle inspired by 19th-century royal tea accessories. Develops a gorgeous vintage patina over time.",
      categoryId: catSouvenirs.id,
      basePrice: 550,
      comparePrice: null,
      images: JSON.stringify(["/products/brass-infuser.jpg"]),
      sku: "SUV-BRS-INF",
      weight: "120g",
      ingredients: "100% Lead-Free Food-Grade Brass",
      shelfLife: "Lifetime",
      origin: "Jodhpur, Rajasthan",
      hsnCode: "74181024",
      gstPercent: 18,
      isActive: true,
      isFeatured: true,
      isBestseller: false,
      stock: 14,
      lowStockThreshold: 3,
    },
  });

  await prisma.productVariant.createMany({
    data: [
      { productId: p7.id, label: "Brass Infuser (Standard)", price: 550, comparePrice: null, stock: 14, sku: "SUV-BRS-STD" },
    ],
  });

  console.log("Products and Variants seeded successfully!");

  // 5. Create Testimonials
  console.log("Seeding testimonials...");
  await prisma.testimonial.createMany({
    data: [
      {
        name: "Vikram Malhotra",
        location: "Kolkata",
        rating: 5,
        text: "I have been buying Darjeeling Tea from A. Prakash & Co. since my college days in the 1970s. The quality has remained absolutely unchanged. Unbelievable consistency and deep understanding of tea.",
        source: "Google",
        sortOrder: 1,
      },
      {
        name: "Sarah Jenkins",
        location: "London, UK",
        rating: 5,
        text: "During my visit to Darjeeling, I stopped by their iconic shop. The Heritage Blend coffee and marmalades are sensational! Ordering online now to relive those mountain mornings in London.",
        source: "TripAdvisor",
        sortOrder: 2,
      },
      {
        name: "Ananya Sharma",
        location: "New Delhi",
        rating: 5,
        text: "Their packaging is so premium and heritage-inspired! The solid brass tea infuser along with the First Flush tea made the most beautiful gift for my grandfather. He absolutely loved the since-1928 legacy.",
        source: "Direct",
        sortOrder: 3,
      },
    ],
  });
  console.log("Testimonials seeded successfully!");

  // 6. Create Media Mentions
  console.log("Seeding media mentions...");
  await prisma.mediaMention.createMany({
    data: [
      {
        publication: "The Times of India",
        title: "A. Prakash & Co.: A Legacy of Trust and Quality Since 1928",
        url: "#",
        sortOrder: 1,
      },
      {
        publication: "Outlook Traveller",
        title: "Top 5 Heritage Shops in North India You Must Visit",
        url: "#",
        sortOrder: 2,
      },
      {
        publication: "NDTV Food",
        title: "The Best Artisanal Jams and Cheese Makers in the Himalayas",
        url: "#",
        sortOrder: 3,
      },
    ],
  });
  console.log("Media mentions seeded successfully!");

  // 7. Create Site Settings
  console.log("Seeding site settings...");
  await prisma.siteSetting.createMany({
    data: [
      { key: "site_name", value: "A. Prakash & Co.", label: "Site Name", group: "general" },
      { key: "tagline", value: "Purveyors of Heritage Fine Foods Since 1928", label: "Tagline", group: "general" },
      { key: "contact_email", value: "orders@aprakashco.com", label: "Contact Email", group: "contact" },
      { key: "contact_phone", value: "+91 98765 43210", label: "Contact Phone", group: "contact" },
      { key: "store_address", value: "12, Heritage Boulevard, The Mall Road, Darjeeling, West Bengal - 734101", label: "Store Address", group: "contact" },
      { key: "gstin", value: "19AAPCP1928A1Z5", label: "GSTIN Number", group: "billing" },
      { key: "hsn_default", value: "0902", label: "Default HSN Code", group: "billing" },
    ],
  });
  console.log("Site settings seeded successfully!");

  console.log("Database seeding completed with flying colors! 🌟");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
