-- Atomic stock decrement function to prevent overselling
CREATE OR REPLACE FUNCTION public.decrement_stock_atomic(
  p_table TEXT,
  p_id UUID,
  p_quantity INT
) RETURNS VOID AS $$
BEGIN
  IF p_table = 'products' THEN
    UPDATE public.products
    SET stock_quantity = stock_quantity - p_quantity
    WHERE id = p_id AND stock_quantity >= p_quantity;
  ELSIF p_table = 'product_variants' THEN
    UPDATE public.product_variants
    SET stock_quantity = stock_quantity - p_quantity
    WHERE id = p_id AND stock_quantity >= p_quantity;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Append entry to order status_history
CREATE OR REPLACE FUNCTION public.append_order_status_history(
  p_order_id UUID,
  p_entry JSONB
) RETURNS VOID AS $$
BEGIN
  UPDATE public.orders
  SET status_history = COALESCE(status_history, '[]'::jsonb) || p_entry
  WHERE id = p_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; (prevents double-redemption race condition)
CREATE OR REPLACE FUNCTION public.apply_coupon_atomic(
  p_coupon_id UUID
) RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.coupons
  SET used_count = used_count + 1
  WHERE id = p_coupon_id
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > NOW())
    AND (max_uses IS NULL OR used_count < max_uses);

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
