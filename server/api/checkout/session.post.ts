import Stripe from "stripe";
import { readBody } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const stripeSecret = config.stripeSecret as string | undefined;
  const publishable = (config.public &&
    (config.public as any).stripePublishable) as string | undefined;

  if (!stripeSecret) {
    return createError({
      statusCode: 500,
      statusMessage: "Stripe secret key is not configured on the server.",
    });
  }

  // read request body
  const body = (await readBody(event)) as {
    items?: Array<any>;
    customer?: { email?: string; name?: string };
    currency?: string;
    metadata?: Record<string, string>;
  };

  const items = Array.isArray(body?.items) ? body.items : [];
  if (!items.length) {
    return createError({
      statusCode: 400,
      statusMessage: "No items provided for checkout.",
    });
  }

  // Build origin for success/cancel URLs
  // Try headers first then fallback to host
  const reqHeaders = event.node.req.headers || ({} as Record<string, any>);
  const host = reqHeaders["x-forwarded-host"] || reqHeaders["host"];
  const proto =
    reqHeaders["x-forwarded-proto"] ||
    reqHeaders["x-forwarded-protocol"] ||
    (event.node.req.connection && (event.node.req.connection as any).encrypted
      ? "https"
      : "http") ||
    "https";
  const origin = reqHeaders.origin || (host ? `${proto}://${host}` : "");

  const successUrl = origin
    ? `${origin.replace(/\/$/, "")}/checkout/success`
    : "/checkout/success";
  const cancelUrl = origin ? `${origin.replace(/\/$/, "")}/cart` : "/cart";

  // Create Stripe line items
  // Items expected to have shape: { productId, quantity, product?: { name, price, images } } or { price, name, quantity }
  const currency = (body.currency || "eur").toLowerCase();

  const line_items = items.map((it) => {
    const quantity = Number(it.quantity ?? 1);
    const priceFloat = Number(it.product?.price ?? it.price ?? 0);
    const unit_amount = Math.max(0, Math.round(priceFloat * 100));
    const name =
      it.product?.name ?? it.name ?? `Product #${it.productId ?? "unknown"}`;

    // Images must be absolute URLs for Stripe Checkout. Only include if looks absolute.
    let images: string[] | undefined;
    const imageCandidate =
      it.product?.images && it.product.images.length
        ? it.product.images[0]
        : (it.image ?? null);
    if (
      typeof imageCandidate === "string" &&
      /^https?:\/\//i.test(imageCandidate)
    ) {
      images = [imageCandidate];
    }

    return {
      price_data: {
        currency,
        product_data: {
          name,
          images,
        },
        unit_amount,
      },
      quantity,
    };
  });

  try {
    const stripe = new Stripe(stripeSecret, { apiVersion: "2022-11-15" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: body.customer?.email,
      metadata: {
        source: "varketplace-frontend",
        ...(body.metadata || {}),
      },
    });

    return {
      url: session.url,
      id: session.id,
      publishable,
    };
  } catch (err: any) {
    console.error("Stripe checkout session creation failed:", err);
    return createError({
      statusCode: 500,
      statusMessage: err?.message ?? "Failed to create Stripe Checkout session",
    });
  }
});
